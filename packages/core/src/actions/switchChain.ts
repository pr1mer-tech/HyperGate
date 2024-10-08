import type { Config } from "../createConfig.js";
import type { BaseErrorType, ErrorType } from "../errors/base.js";
import {
  ChainNotConfiguredError,
  type ChainNotConfiguredErrorType,
} from "../errors/config.js";
import {
  type ProviderNotFoundErrorType,
  SwitchChainNotSupportedError,
  type SwitchChainNotSupportedErrorType,
} from "../errors/connector.js";
import type { ConnectorParameter } from "../types/properties.js";
import type { Compute, ExactPartial } from "../types/utils.js";

export type SwitchChainParameters<
  config extends Config = Config,
  chainId extends
    config["chains"][number]["id"] = config["chains"][number]["id"],
> = Compute<
  ConnectorParameter & {
    chainId: chainId | config["chains"][number]["id"];
  }
>;

export type SwitchChainReturnType<
  config extends Config = Config,
  chainId extends
    config["chains"][number]["id"] = config["chains"][number]["id"],
> = Extract<
  config["chains"][number],
  { id: Config extends config ? number : chainId }
>;

export type SwitchChainErrorType =
  | SwitchChainNotSupportedErrorType
  | ChainNotConfiguredErrorType
  // connector.switchChain()
  | ProviderNotFoundErrorType
  // base
  | BaseErrorType
  | ErrorType
  | Error;

export async function switchChain<
  config extends Config,
  chainId extends config["chains"][number]["id"],
>(
  config: config,
  parameters: SwitchChainParameters<config, chainId>,
): Promise<SwitchChainReturnType<config, chainId>> {
  const { chainId } = parameters;

  const connection = config.state.connections.get(
    parameters.connector?.uid ?? config.state.current!,
  );
  if (connection) {
    const connector = connection.connector;
    if (!connector.switchChain)
      throw new SwitchChainNotSupportedError({ connector });
    const chain = await connector.switchChain({
      chainId,
    });
    return chain as SwitchChainReturnType<config, chainId>;
  }

  const chain = config.chains.find((x) => x.id === chainId);
  if (!chain) throw new ChainNotConfiguredError();
  config.setState((x) => ({ ...x, chainId }));
  return chain as SwitchChainReturnType<config, chainId>;
}
