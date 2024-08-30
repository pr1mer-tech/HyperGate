import { createContext, useContext } from "react";
import type { Config, ResolvedRegister } from "@hypergate/core";
import type { ConfigParameter } from "../types/properties";

// Create a context for the config
const ConfigContext = createContext<Config | undefined>(undefined);

// Props type for the HyperGateConfig component
interface HyperGateConfigProps {
  config: Config;
  children: React.ReactNode;
}

// HyperGateConfig provider component
export const HyperGateConfig: React.FC<HyperGateConfigProps> = ({
  config,
  children,
}) => {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};

export type UseConfigParameters<config extends Config = Config> =
  ConfigParameter<config>;

// Custom hook to use the config
export const useConfig = <config extends Config = ResolvedRegister["config"]>(
  parameters: UseConfigParameters<config> = {},
): Config => {
  const context = parameters.config ?? useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a HyperGateConfig provider");
  }
  return context;
};
