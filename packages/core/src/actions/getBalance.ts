import type { Config } from "../createConfig.js";
import { BaseError } from "../errors/base.js";
import { Address } from "../internal.js";
import type { ChainIdParameter } from "../types/properties.js";
import type { Compute } from "../types/utils.js";
import { xrpToEth } from "../utils/numbers.js";
import { BlockTag } from "./getBlock.js";

export type GetBalanceParameters<config extends Config = Config> = Compute<
  ChainIdParameter<config> & {
    address: Address;
    blockNumber?: BlockTag;
  } & (
      | { token: Address; symbol: string }
      | { token?: undefined; symbol?: undefined }
    )
>;

export type GetBalanceReturnType = {
  decimals: number;
  symbol: string;
  value: bigint;
};

export class GetBalanceErrorType extends BaseError {
  override name = "GetBalanceError";
  constructor() {
    super("Failed to get balance");
  }
}

export async function getBalance(
  config: Config,
  parameters: GetBalanceParameters,
): Promise<GetBalanceReturnType> {
  const { address, blockNumber, chainId, token: tokenAddress } = parameters;

  if (tokenAddress) {
    return getTokenBalance(config, {
      balanceAddress: address,
      chainId,
      tokenAddress,
      symbol: parameters.symbol,
      blockNumber,
    });
  }

  const client = await config.getClient({ chainId });
  const value = await client.request({
    command: "account_info",
    account: address,
    ledger_index: blockNumber,
  });
  const chain = config.chains.find((x) => x.id === chainId) ?? {
    id: chainId,
    rpc: client.url,
    nativeCurrency: { decimals: 6, symbol: "XRP" },
  };
  return {
    decimals: 18,
    symbol: chain.nativeCurrency?.symbol ?? "XRP",
    value: xrpToEth(
      value.result.account_data.Balance,
      chain.nativeCurrency?.decimals ?? 6,
    ),
  };
}

type GetTokenBalanceParameters = {
  balanceAddress: Address;
  chainId?: number | undefined;
  tokenAddress: Address;
  symbol: string;
  blockNumber?: number | "current" | "closed" | "validated";
};

async function getTokenBalance(
  config: Config,
  parameters: GetTokenBalanceParameters,
) {
  const { balanceAddress, chainId, tokenAddress, blockNumber, symbol } =
    parameters;
  const client = await config.getClient({ chainId });
  const hotBalances = await client.request({
    command: "account_lines",
    account: balanceAddress,
    ledger_index: blockNumber,
  });

  const trustline = hotBalances.result.lines.find(
    (x) => x.currency === symbol && x.account === tokenAddress,
  );

  if (!trustline) {
    throw new GetBalanceErrorType();
  }

  const decimals = 18; // We are using Ethereum's decimals for all tokens
  const formatted = trustline.balance;
  const value = xrpToEth(trustline.balance, 0); // Tokens have 0 decimals

  return { decimals, formatted, symbol, value };
}
