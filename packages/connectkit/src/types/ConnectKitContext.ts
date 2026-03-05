import type { ReactNode } from "react";
import type {
  CustomTheme,
  Languages,
  Mode,
  Theme,
  CustomAvatarProps,
} from "../types";
import type { useConnectCallbackProps } from "../hooks/useConnectCallback";

export type Connector = {
  id: string;
};

export type Error = string | ReactNode | null;

export type ContextValue = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  customTheme: CustomTheme | undefined;
  setCustomTheme: React.Dispatch<React.SetStateAction<CustomTheme | undefined>>;
  lang: Languages;
  setLang: React.Dispatch<React.SetStateAction<Languages>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  route: string;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
  connector: Connector;
  setConnector: React.Dispatch<React.SetStateAction<Connector>>;
  errorMessage: Error;
  options?: ConnectKitOptions;
  signInWithEthereum: boolean;
  debugMode?: boolean;
  log: (...props: any) => void;
  displayError: (message: string | ReactNode | null, code?: any) => void;
  resize: number;
  triggerResize: () => void;
} & useConnectCallbackProps;

export type ConnectKitOptions = {
  language?: Languages;
  hideBalance?: boolean;
  hideTooltips?: boolean;
  hideQuestionMarkCTA?: boolean;
  hideNoWalletCTA?: boolean;
  hideRecentBadge?: boolean;
  walletConnectCTA?: "link" | "modal" | "both";
  avoidLayoutShift?: boolean;
  embedGoogleFonts?: boolean;
  truncateLongENSAddress?: boolean;
  walletConnectName?: string;
  reducedMotion?: boolean;
  disclaimer?: ReactNode | string;
  bufferPolyfill?: boolean;
  customAvatar?: React.FC<CustomAvatarProps>;
  initialChainId?: number;
  enforceSupportedChains?: boolean;
  ethereumOnboardingUrl?: string;
  walletOnboardingUrl?: string;
  disableSiweRedirect?: boolean;
  overlayBlur?: number;
};
