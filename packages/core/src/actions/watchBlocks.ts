import { LedgerStream } from "xrpl";
import type { Config } from "../createConfig.js";
import type {
  ChainIdParameter,
  SyncConnectedChainParameter,
} from "../types/properties.js";
import type { Compute } from "../types/utils.js";
import { BlockTag, GetBlockParameters } from "./getBlock.js";

export type WatchBlocksParameters<
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = "current",
  config extends Config = Config,
  ///
> = Compute<
  GetBlockParameters<includeTransactions, blockTag> &
    ChainIdParameter<config> &
    SyncConnectedChainParameter & {
      onBlock(block: LedgerStream): void;
    }
>;

export type WatchBlocksReturnType = () => void;

export async function watchBlocks<
  config extends Config,
  chainId extends
    config["chains"][number]["id"] = config["chains"][number]["id"],
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = "current",
>(
  config: config,
  parameters: WatchBlocksParameters<includeTransactions, blockTag, config>,
): Promise<WatchBlocksReturnType> {
  let unwatch: WatchBlocksReturnType | undefined;
  const listener = async (chainId: number | undefined) => {
    if (unwatch) unwatch();

    const client = await config.getClient({ chainId });
    await client.request({
      command: "subscribe",
      streams: ["ledger"],
    });

    client.once("ledgerClosed", parameters.onBlock);

    unwatch = () => {
      client.off("ledgerClosed", parameters.onBlock);
      setTimeout(() => {
        if (!client.eventNames().includes("ledgerClosed")) {
          client.request({
            command: "unsubscribe",
            streams: ["ledger"],
          });
        }
      }, 1000); // wait 1 second before unsubscribing - this fixes the async issue
    };
    return unwatch;
  };

  // set up listener for block number changes
  const unlisten = await listener(parameters.chainId);

  // set up subscriber for connected chain changes
  let unsubscribe: (() => void) | undefined;
  if (!parameters.chainId)
    unsubscribe = config.subscribe(
      ({ chainId }) => chainId,
      async (chainId) => listener(chainId),
    );

  return () => {
    unlisten?.();
    unsubscribe?.();
  };
}
