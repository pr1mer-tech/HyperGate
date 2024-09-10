import { useContext } from "react";
import type { Config, ResolvedRegister } from "@hypergate/core";
import type { ConfigParameter } from "../types/properties";
import { HyperGateContext } from "../context";

export type UseConfigParameters<config extends Config = Config> =
  ConfigParameter<config>;

// Custom hook to use the config
export const useConfig = <config extends Config = ResolvedRegister["config"]>(
  parameters: UseConfigParameters<config> = {},
): Config => {
  const context = parameters.config ?? useContext(HyperGateContext);
  if (context === undefined) {
    throw new Error(
      "useConfig must be used within a HyperGateProvier provider",
    );
  }
  return context;
};
