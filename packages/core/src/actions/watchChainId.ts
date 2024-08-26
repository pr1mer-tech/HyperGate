import type { Config } from "../createConfig.js";
import type { GetChainIdReturnType } from "./getChainId.js";

export type WatchChainIdParameters = {
  onChange(
    chainId: GetChainIdReturnType,
    prevChainId: GetChainIdReturnType,
  ): void;
};

export type WatchChainIdReturnType = () => void;

export function watchChainId(
  config: Config,
  parameters: WatchChainIdParameters,
): WatchChainIdReturnType {
  const { onChange } = parameters;
  return config.subscribe((state) => state.chainId, onChange);
}
