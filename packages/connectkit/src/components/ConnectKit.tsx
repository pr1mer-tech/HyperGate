"use client";

import React, {
  createElement,
  useEffect,
  useState,
} from "react";
import { Buffer } from "buffer";
import type { Languages, Mode, Theme, CustomTheme } from "../types";
import type { ConnectKitOptions, ContextValue, Connector } from "../types/ConnectKitContext";

import defaultTheme from "../styles/defaultTheme";

import ConnectKitModal from "../components/ConnectModal";
import { ThemeProvider } from "styled-components";
import { useThemeFont } from "../hooks/useGoogleFont";
import { useChains } from "../hooks/useChains";
import {
  useConnectCallback,
  type useConnectCallbackProps,
} from "../hooks/useConnectCallback";
import { isFamily } from "../utils/wallets";
import { useConnector } from "../hooks/useConnectors";
import { HyperGateContext, useAccount } from "@hyper-gate/react";
import { Web3ContextProvider } from "./contexts/web3";
import { useChainIsSupported } from "../hooks/useChainIsSupported";
import type { Config } from "@hyper-gate/core";

import { routes } from "../constants/routes";
import { Context } from "../contexts/ConnectKitContext";

type ConnectKitProviderProps = {
  children?: React.ReactNode;
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme;
  options?: ConnectKitOptions;
  debugMode?: boolean;
  context?: React.Context<Config | undefined>;
} & useConnectCallbackProps;

export const ConnectKitProvider = ({
  children,
  theme = "auto",
  mode = "auto",
  customTheme,
  options,
  onConnect,
  onDisconnect,
  debugMode = false,
  context,
}: ConnectKitProviderProps) => {
  // ConnectKitProvider must be within a WagmiProvider
  if (!React.useContext(context ?? HyperGateContext)) {
    throw Error("ConnectKitProvider must be within a HypergateProvider");
  }

  // Only allow for mounting ConnectKitProvider once, so we avoid weird global
  // state collisions.
  if (React.useContext(Context)) {
    throw new Error(
      "Multiple, nested usages of ConnectKitProvider detected. Please use only one.",
    );
  }

  useConnectCallback({
    onConnect,
    onDisconnect,
  });

  const chains = useChains();

  const injectedConnector = useConnector("injected");

  // Default config options
  const defaultOptions: ConnectKitOptions = {
    language: "en-US",
    hideBalance: false,
    hideTooltips: false,
    hideQuestionMarkCTA: false,
    hideNoWalletCTA: false,
    walletConnectCTA: "link",
    hideRecentBadge: false,
    avoidLayoutShift: true,
    embedGoogleFonts: false,
    truncateLongENSAddress: true,
    walletConnectName: undefined,
    reducedMotion: false,
    disclaimer: null,
    bufferPolyfill: true,
    customAvatar: undefined,
    initialChainId: chains?.[0]?.id,
    enforceSupportedChains: false,
    ethereumOnboardingUrl: undefined,
    walletOnboardingUrl: undefined,
    disableSiweRedirect: false,
  };

  const opts: ConnectKitOptions = Object.assign({}, defaultOptions, options);

  if (typeof window !== "undefined") {
    // Buffer Polyfill, needed for bundlers that don't provide Node polyfills (e.g CRA, Vite, etc.)
    if (opts.bufferPolyfill) window.Buffer = window.Buffer ?? Buffer;

    // Some bundlers may need `global` and `process.env` polyfills as well
    // Not implemented here to avoid unexpected behaviors, but leaving example here for future reference
    /*
     * window.global = window.global ?? window;
     * window.process = window.process ?? { env: {} };
     */
  }

  const [ckTheme, setTheme] = useState<Theme>(theme);
  const [ckMode, setMode] = useState<Mode>(mode);
  const [ckCustomTheme, setCustomTheme] = useState<CustomTheme | undefined>(
    customTheme ?? {},
  );
  const [ckLang, setLang] = useState<Languages>("en-US");
  const [open, setOpen] = useState<boolean>(false);
  const [connector, setConnector] = useState<ContextValue["connector"]>({
    id: "",
  });
  const [route, setRoute] = useState<string>(routes.CONNECTORS);
  const [errorMessage, setErrorMessage] = useState<Error>("");

  const [resize, onResize] = useState<number>(0);

  // Include Google Font that is needed for a themes
  if (opts.embedGoogleFonts) useThemeFont(theme);

  // Other Configuration
  useEffect(() => setTheme(theme), [theme]);
  useEffect(() => setLang(opts.language || "en-US"), [opts.language]);
  useEffect(() => setErrorMessage(null), [route, open]);

  // Check if chain is supported, elsewise redirect to switches page
  const { chain, isConnected } = useAccount();
  const isChainSupported = useChainIsSupported(chain?.id);

  useEffect(() => {
    if (isConnected && opts.enforceSupportedChains && !isChainSupported) {
      setOpen(true);
      setRoute(routes.SWITCHNETWORKS);
    }
  }, [isConnected, isChainSupported, chain, route, open]);

  // Autoconnect to Family wallet if available
  useEffect(() => {
    if (isFamily()) {
      injectedConnector?.connect();
    }
  }, [injectedConnector]);

  const log = debugMode ? console.log : () => {};

  const value = {
    theme: ckTheme,
    setTheme,
    mode: ckMode,
    setMode,
    customTheme,
    setCustomTheme,
    lang: ckLang,
    setLang,
    open,
    setOpen,
    route,
    setRoute,
    connector,
    setConnector,
    signInWithEthereum: false,
    onConnect,
    // Other configuration
    options: opts,
    errorMessage,
    debugMode,
    log,
    displayError: (message: string | React.ReactNode | null, code?: any) => {
      setErrorMessage(message);
      console.log("---------CONNECTKIT DEBUG---------");
      console.log(message);
      if (code) console.table(code);
      console.log("---------/CONNECTKIT DEBUG---------");
    },
    resize,
    triggerResize: () => onResize((prev) => prev + 1),
  };

  return createElement(
    Context.Provider,
    { value },
    <Web3ContextProvider enabled={open}>
      <ThemeProvider theme={defaultTheme}>
        {children}
        <ConnectKitModal
          lang={ckLang}
          theme={ckTheme}
          mode={mode}
          customTheme={ckCustomTheme}
        />
      </ThemeProvider>
    </Web3ContextProvider>,
  );
};
