import type { Transaction } from "xrpl";

import type { Config, Connector } from "../createConfig.js";
import type { BaseErrorType, ErrorType } from "../errors/base.js";
import type { ConnectorParameter } from "../types/properties.js";
import type { Compute } from "../types/utils.js";
import type { GetConnectorClientErrorType } from "./getConnectorClient.js";
import { ConnectorNotFoundError } from "../errors/config.js";

export type SignMessageParameters = Compute<ConnectorParameter & Transaction>;

export type SignMessageReturnType = string;

export type SignMessageErrorType =
  // getConnectorClient()
  | GetConnectorClientErrorType
  // base
  | BaseErrorType
  | ErrorType;

export async function sendTransaction(
  config: Config,
  parameters: SignMessageParameters,
): Promise<SignMessageReturnType> {
  const { Account: account, ...rest } = parameters;

  let connector: Connector | undefined;
  if (parameters.connector) connector = parameters.connector;
  else {
    const { connections, current } = config.state;
    const connection = connections.get(current!);
    connector = connection?.connector;
  }

  const connections = config.state.connections;

  if (!connector) {
    throw new ConnectorNotFoundError();
  }
  const tx = await connector.signAndSubmitTransaction(parameters);

  return tx;
}
