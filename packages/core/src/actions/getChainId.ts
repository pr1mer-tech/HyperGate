import type { Config } from "../createConfig.js";

export type GetChainIdReturnType = number;

export function getChainId(config: Config): GetChainIdReturnType {
  return config.state.chainId;
}
