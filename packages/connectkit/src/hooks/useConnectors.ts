import { Connector } from "@hypergate/core";
import { useConnectors as useHyperGateConnectors } from "@hypergate/react";

export function useConnectors() {
  const connectors = useHyperGateConnectors();
  return connectors ?? [];
}

export function useConnector(id: string, uuid?: string) {
  const connectors = useConnectors();
  if (id === "injected" && uuid) {
    return connectors.find((c) => c.id === id && c.name === uuid) as Connector;
  } else if (id === "injected") {
    return connectors.find(
      (c) => c.id === id && c.name.includes("Injected"),
    ) as Connector;
  }
  return connectors.find((c) => c.id === id) as Connector;
}

export function useInjectedConnector(uuid?: string) {
  /*
  options: {
    shimDisconnect: true,
    name: (
      detectedName: string | string[] // Detects the name of the injected wallet
    ) =>
      `Injected (${
        typeof detectedName === 'string'
          ? detectedName
          : detectedName.join(', ')
      })`,
  }
  */
  return useConnector("injected", uuid);
}
export function useWalletConnectConnector() {
  /*
  options: {
    qrcode: false,
    // or
    showQrModal: false,
  }
  */
  return useConnector("walletConnect");
}
export function useCoinbaseWalletConnector() {
  /*
  options: {
    headlessMode: true,
  }
  */
  return useConnector("coinbaseWalletSDK");
}
export function useMetaMaskConnector() {
  /*
  options: {
    shimDisconnect: true,
    shimChainChangedDisconnect: true,
    UNSTABLE_shimOnConnectSelectAccount: true,
  }
  */
  return useConnector("metaMask");
}
