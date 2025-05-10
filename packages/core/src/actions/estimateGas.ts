import type { Chain } from "../chains.js";
import type { Config } from "../createConfig.js";
import type { BaseErrorType, ErrorType } from "../errors/base.js";
import type { Address } from "../internal.js";
import type { SelectChains } from "../types/chain.js";
import type {
  ChainIdParameter,
  ConnectorParameter,
} from "../types/properties.js";
import type {
  UnionCompute,
  UnionLooseOmit,
  UnionOmit,
} from "../types/utils.js";
import {
  type GetConnectorClientErrorType,
  getConnectorClient,
} from "./getConnectorClient.js";
import type { BlockTag } from "./getBlock.js";
import type { SubmittableTransaction } from "xrpl";

export type core_EstimateGasParameters = FormattedEstimateGas & {
  Account?: Address | undefined;
};
type FormattedEstimateGas = SubmittableTransaction;

export type core_EstimateGasReturnType = bigint;

export type core_EstimateGasErrorType = ErrorType;

export type EstimateGasParameters<
  config extends Config = Config,
  chainId extends
    | config["chains"][number]["id"]
    | undefined = config["chains"][number]["id"],
  ///
  chains extends readonly Chain[] = SelectChains<config, chainId>,
> = {
  [key in keyof chains]: UnionCompute<
    UnionLooseOmit<core_EstimateGasParameters, "chain"> &
      ChainIdParameter<config> &
      ConnectorParameter
  >;
}[number];

export type EstimateGasReturnType = core_EstimateGasReturnType;

export type EstimateGasErrorType =
  // getConnectorClient()
  | GetConnectorClientErrorType
  // base
  | BaseErrorType
  | ErrorType
  | core_EstimateGasErrorType;

/** https://wagmi.sh/core/api/actions/estimateGas */
export async function estimateGas<
  config extends Config,
  chainId extends config["chains"][number]["id"] | undefined = undefined,
>(
  config: config,
  parameters: EstimateGasParameters<config, chainId>,
): Promise<EstimateGasReturnType> {
  const { chainId, connector, ...rest } = parameters;

  let account: Address;
  if (parameters.Account) account = parameters.Account as Address;
  else {
    const connectorClient = await getConnectorClient(config, {
      account: parameters.Account as Address,
      chainId,
      connector,
    });
    account = connectorClient.accounts[0];
  }

  const client = await config.getClient({ chainId });
  const filled = await client.autofill({
    ...parameters,
    Account: account,
  });
  const fees = BigInt(filled.Fee ?? "0");
  return fees;
}
