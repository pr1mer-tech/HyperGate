import type { Client } from "xrpl";
import type { Config, Connection } from "../createConfig.js";
import type { BaseErrorType, ErrorType } from "../errors/base.js";
import {
  type ConnectorAccountNotFoundErrorType,
  ConnectorChainMismatchError,
  type ConnectorChainMismatchErrorType,
  ConnectorNotConnectedError,
  type ConnectorNotConnectedErrorType,
  ConnectorUnavailableReconnectingError,
  type ConnectorUnavailableReconnectingErrorType,
} from "../errors/config.js";
import type { Address } from "../internal.js";
import type {
  ChainIdParameter,
  ConnectorParameter,
} from "../types/properties.js";
import type { Compute } from "../types/utils.js";

export type GetConnectorClientParameters<config extends Config = Config> =
  Compute<
    ChainIdParameter<config> &
      ConnectorParameter & {
        /**
         * Account to use for the client.
         *
         * - `Account | Address`: An Account MUST exist on the connector.
         * - `null`: Account MAY NOT exist on the connector. This is useful for
         *   actions that can infer the account from the connector (e.g. sending a
         *   call without a connected account – the user will be prompted to select
         *   an account within the wallet).
         */
        account?: Address | null | undefined;
      }
  >;

export type GetConnectorClientReturnType = Compute<
  Client & {
    accounts: readonly [Address, ...Address[]];
  }
>;

export type GetConnectorClientErrorType =
  | ConnectorAccountNotFoundErrorType
  | ConnectorChainMismatchErrorType
  | ConnectorNotConnectedErrorType
  | ConnectorUnavailableReconnectingErrorType
  // base
  | BaseErrorType
  | ErrorType;

export async function getConnectorClient<config extends Config>(
  config: config,
  parameters: GetConnectorClientParameters<config> = {},
): Promise<GetConnectorClientReturnType> {
  // Get connection
  let connection: Connection | undefined;
  if (parameters.connector) {
    const { connector } = parameters;
    if (
      config.state.status === "reconnecting" &&
      !connector.getAccounts &&
      !connector.getChainId
    )
      throw new ConnectorUnavailableReconnectingError({ connector });

    const [accounts, chainId] = await Promise.all([
      connector.getAccounts().catch((e) => {
        if (parameters.account === null) return [];
        throw e;
      }),
      connector.getChainId(),
    ]);
    connection = {
      accounts: accounts as readonly [Address, ...Address[]],
      chainId: Number(chainId),
      connector: {
        ...connector,
        uid: connector.uid ?? "",
      },
    };
  } else connection = config.state.connections.get(config.state.current ?? "");
  if (!connection) throw new ConnectorNotConnectedError();

  const chainId = parameters.chainId ?? connection.chainId;

  // Check connector using same chainId as connection
  const connectorChainId = await connection.connector.getChainId();
  if (connectorChainId !== connection.chainId)
    throw new ConnectorChainMismatchError({
      connectionChainId: connection.chainId,
      connectorChainId: Number(connectorChainId),
    });

  // If connector has custom `getClient` implementation
  type Return = GetConnectorClientReturnType;
  const client = await config.getClient({ chainId });
  return {
    ...client,
    accounts: connection.accounts,
  } as Return;
}
