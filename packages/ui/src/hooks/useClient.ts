"use client";

import {
  type Config,
  type GetClientParameters,
  type GetClientReturnType,
  type ResolvedRegister,
  getClient,
  watchClient,
} from "@hyper-gate/core";
import type { Compute } from "@hyper-gate/core/internal";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector.js";

import type { ConfigParameter } from "../types/properties.js";
import { useConfig } from "./useConfig.js";

export type UseClientParameters<
  config extends Config = Config,
  chainId extends config["chains"][number]["id"] | number | undefined =
    | config["chains"][number]["id"]
    | undefined,
> = Compute<GetClientParameters<config> & ConfigParameter<config>>;

export type UseClientReturnType<
  config extends Config = Config,
  chainId extends config["chains"][number]["id"] | number | undefined =
    | config["chains"][number]["id"]
    | undefined,
> = GetClientReturnType<config, chainId>;

export function useClient<
  config extends Config = ResolvedRegister["config"],
  chainId extends config["chains"][number]["id"] | number | undefined =
    | config["chains"][number]["id"]
    | undefined,
>(
  parameters: UseClientParameters<config, chainId> = {},
): UseClientReturnType<config, chainId> {
  const config = useConfig(parameters);

  return useSyncExternalStoreWithSelector(
    (onChange) => watchClient(config, { onChange }),
    () => getClient(config, parameters),
    () => getClient(config, parameters),
    (x) => x,
    (a, b) =>
      a?.url === b?.url &&
      a?.apiVersion === b?.apiVersion &&
      a?.buildVersion === b?.buildVersion &&
      a?.networkID === b?.networkID,
  ) as UseClientReturnType<config, chainId>;
}
