import { LedgerResponse } from "xrpl";
import type { Config } from "../createConfig.js";
import type { ChainIdParameter } from "../types/properties.js";
import type { Compute } from "../types/utils.js";
import { BaseError } from "../errors/base.js";

export type BlockTag = number | "current" | "closed" | "validated";

export type GetBlockParameters<
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = "current",
  config extends Config = Config,
  chainId extends
    config["chains"][number]["id"] = config["chains"][number]["id"],
> = Compute<
  (
    | {
        blockNumber?: blockTag;
        blockHash?: undefined;
      }
    | {
        blockNumber?: undefined;
        blockHash?: string;
      }
  ) & {
    includeTransactions?: includeTransactions;
  } & ChainIdParameter<config>
>;

export type GetBlockReturnType = Compute<
  LedgerResponse["result"] & {
    chainId?: number;
  }
>;

export class GetBlockErrorType extends BaseError {
  override name = "GetBlockError";
  constructor() {
    super("Failed to fetch block");
  }
}

export async function getBlock<
  config extends Config,
  chainId extends config["chains"][number]["id"],
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = "current",
>(
  config: config,
  parameters: GetBlockParameters<
    includeTransactions,
    blockTag,
    config,
    chainId
  > = {},
): Promise<GetBlockReturnType> {
  const { chainId, ...rest } = parameters;
  const client = await config.getClient({ chainId });
  const block = await client.request({
    command: "ledger",
    ledger_index: rest.blockNumber,
    ledger_hash: rest.blockHash,
    transactions: parameters.includeTransactions,
  });
  return {
    ...(block.result as GetBlockReturnType),
    chainId,
  };
}
