import type { Config } from "../createConfig.js";
import type { BaseErrorType, ErrorType } from "../errors/base.js";
import {
  ConnectorAlreadyConnectedError,
  type ConnectorAlreadyConnectedErrorType,
} from "../errors/config.js";
import type { ChainIdParameter } from "../types/properties.js";
import type { Compute } from "../types/utils.js";
import type { Connector } from "../connectors/connector.js";
import type { Address } from "../internal.js";

export type ConnectParameters<config extends Config = Config> = Compute<
  ChainIdParameter<config> & {
    connector: Connector;
  }
>;

export type ConnectReturnType<config extends Config = Config> = {
  accounts: readonly [Address, ...Address[]];
  chainId: number;
};

export type ConnectErrorType =
  | ConnectorAlreadyConnectedErrorType
  // base
  | BaseErrorType
  | ErrorType;

export async function connect<config extends Config>(
  config: config,
  parameters: ConnectParameters<config>,
): Promise<ConnectReturnType<config>> {
  // "Register" connector if not already created
  let connector: Connector;
  if (typeof parameters.connector === "function") {
    connector = config._internal.connectors.setup(parameters.connector);
  } else connector = parameters.connector;

  // Check if connector is already connected
  if (connector.uid === config.state.current)
    throw new ConnectorAlreadyConnectedError();

  try {
    config.setState((x) => ({ ...x, status: "connecting" }));
    connector.emitter?.emit("message", { type: "connecting" });

    const data = await connector.connect({ chainId: parameters.chainId });
    const accounts = data.accounts as readonly [Address, ...Address[]];

    connector.emitter?.off("connect", config._internal.events.connect);
    connector.emitter?.on("change", config._internal.events.change);
    connector.emitter?.on("disconnect", config._internal.events.disconnect);

    await config.storage?.setItem("recentConnectorId", connector.id);
    config.setState((x) => ({
      ...x,
      connections: new Map(x.connections).set(connector.uid ?? "", {
        accounts,
        chainId: data.chainId,
        //@ts-expect-error - TODO: fix this
        connector: connector,
      }),
      current: connector.uid ?? null,
      status: "connected",
    }));

    return { accounts, chainId: data.chainId };
  } catch (error) {
    config.setState((x) => ({
      ...x,
      // Keep existing connector connected in case of error
      status: x.current ? "connected" : "disconnected",
    }));
    throw error;
  }
}
