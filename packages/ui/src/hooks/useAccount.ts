"use client";

import {
  type Config,
  type GetAccountReturnType,
  type ResolvedRegister,
  getAccount,
  watchAccount,
} from "@hypergate/core";

import type { ConfigParameter } from "../types/properties.js";
import { useConfig } from "./useConfig.jsx";
import { useSyncExternalStoreWithTracked } from "./useSyncExternalStoreWithTracked.js";

export type UseAccountParameters<config extends Config = Config> =
  ConfigParameter<config>;

export type UseAccountReturnType<config extends Config = Config> =
  GetAccountReturnType;

/** https://hypergate.pr1mer.tech/docs/react/useAccount */
export function useAccount<config extends Config = ResolvedRegister["config"]>(
  parameters: UseAccountParameters<config> = {},
): UseAccountReturnType<config> {
  const config = useConfig(parameters);

  return useSyncExternalStoreWithTracked(
    (onChange) => watchAccount(config, { onChange }),
    () => getAccount(config),
  );
}
