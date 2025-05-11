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
  const block = await getBlock(config, parameters);

  if (!block || !block.ledger_index) return -1n;
  if (typeof block.ledger_index === "bigint") {
    return block.ledger_index;
  }
  // Check if ledger_index can be converted to bigint, - if it's a valid "number", that is not a float
  if (typeof block.ledger_index !== "number" || block.ledger_index % 1 !== 0) {
    return -1n;
  }
  return BigInt(block.ledger_index);
}
