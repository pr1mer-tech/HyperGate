import { createConfig, xrplMainnet, type Config } from "@hypergate/core";
import { useChainIsSupported } from "../hooks/useChainIsSupported";

const ensFallbackConfig = createConfig({
  chains: [xrplMainnet],
  connectors: [],
});

export function useEnsFallbackConfig(): Config | undefined {
  return !useChainIsSupported(0) ? ensFallbackConfig : undefined;
}
