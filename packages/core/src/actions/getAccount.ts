import type { Config } from "../createConfig";

export function getAccount(config: Config) {
  const connection = config.state.current
    ? config.state.connections.get(config.state.current)
    : null;

  const accounts = connection?.accounts;
  const chainId = connection?.chainId ? Number(connection.chainId) : undefined;
  const chain = config.chains.find((chain) => chain.id === chainId);
  const connector = connection?.connector;
  const status = config.state.status;

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";
  const isDisconnected = status === "disconnected";
  const isReconnecting = status === "reconnecting";

  return {
    address: accounts?.[0],
    addresses: accounts,
    chainId,
    chain,
    connector,
    status,
    isConnected,
    isConnecting,
    isDisconnected,
    isReconnecting,
  };
}

export type GetAccountReturnType = ReturnType<typeof getAccount>;
