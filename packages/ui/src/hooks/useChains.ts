"use client";

import {
  type Config,
  type GetChainsReturnType,
  type ResolvedRegister,
  getChains,
  watchChains,
} from "@hypergate/core";
import { useSyncExternalStore } from "react";

import type { ConfigParameter } from "../types/properties.js";
import { useConfig } from "./useConfig.js";

export type UseChainsParameters<config extends Config = Config> =
  ConfigParameter<config>;

export type UseChainsReturnType<config extends Config = Config> =
  GetChainsReturnType<config>;

/** https://hypergate.pr1mer.tech/docs/react/useChains */
export function useChains<config extends Config = ResolvedRegister["config"]>(
  parameters: UseChainsParameters<config> = {},
): UseChainsReturnType<config> {
  const config = useConfig(parameters);

  return useSyncExternalStore(
    (onChange) => watchChains(config, { onChange }),
    () => getChains(config),
    () => getChains(config),
  );
}
