import type { Client } from "xrpl";
import type { Config } from "../createConfig.js";
import type { ChainIdParameter } from "../types/properties.js";
import type { Compute, IsNarrowable } from "../types/utils.js";

export type GetClientParameters<config extends Config = Config> =
  ChainIdParameter<config>;

export type GetClientReturnType<
  config extends Config = Config,
  chainId extends
    | config["chains"][number]["id"]
    | undefined = config["chains"][number]["id"],
  ///
  resolvedChainId extends
    | config["chains"][number]["id"]
    | undefined = IsNarrowable<
    config["chains"][number]["id"],
    number
  > extends true
    ? IsNarrowable<chainId, number> extends true
      ? chainId
      : config["chains"][number]["id"]
    : config["chains"][number]["id"] | undefined,
> = resolvedChainId extends config["chains"][number]["id"]
  ? Compute<Client>
  : undefined;

export function getClient<
  config extends Config,
  chainId extends config["chains"][number]["id"] | number | undefined,
>(
  config: config,
  parameters: GetClientParameters<config> = {},
): GetClientReturnType<config, chainId> {
  let client = undefined;
  try {
    client = config.getClient(parameters);
  } catch {}
  return client as GetClientReturnType<config, chainId>;
}
