import type { Config } from "../createConfig.js";
import type { ChainIdParameter } from "../types/properties.js";
import type { Compute } from "../types/utils.js";
import { BlockTag, getBlock, GetBlockErrorType } from "./getBlock.js";

export type GetBlockNumberParameters<config extends Config = Config> = Compute<
  (
    | {
        blockNumber?: BlockTag;
        blockHash?: undefined;
      }
    | {
        blockNumber?: undefined;
        blockHash?: string;
      }
  ) &
    ChainIdParameter<config>
>;

export type GetBlockNumberReturnType = bigint;

export type GetBlockNumberErrorType = GetBlockErrorType;

export async function getBlockNumber<config extends Config>(
  config: config,
  parameters: GetBlockNumberParameters<config> = {},
): Promise<GetBlockNumberReturnType> {
  const block = getBlock(config, parameters);
  const block_1 = await block;
  return BigInt(block_1.ledger_index);
}
