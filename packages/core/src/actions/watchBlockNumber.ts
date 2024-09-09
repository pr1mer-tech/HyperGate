import type { Config } from "../createConfig.js";
import type {
  ChainIdParameter,
  SyncConnectedChainParameter,
} from "../types/properties.js";
import type { Compute } from "../types/utils.js";
import { GetBlockNumberParameters } from "./getBlockNumber.js";
import { watchBlocks } from "./watchBlocks.js";

export type WatchBlockNumberParameters<
  config extends Config = Config,
  ///
> = Compute<
  GetBlockNumberParameters<config> &
    ChainIdParameter<config> &
    SyncConnectedChainParameter & {
      onBlockNumber(block: bigint): void;
    }
>;

export type WatchBlockNumberReturnType = () => void;

export async function watchBlockNumber<config extends Config>(
  config: config,
  parameters: WatchBlockNumberParameters<config>,
): Promise<WatchBlockNumberReturnType> {
  return watchBlocks(config, {
    ...parameters,
    onBlock(block) {
      parameters.onBlockNumber(BigInt(block.ledger_index));
    },
  });
}
