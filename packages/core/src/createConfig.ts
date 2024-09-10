import { persist, subscribeWithSelector } from "zustand/middleware";
import { type Mutate, type StoreApi, createStore } from "zustand/vanilla";
import type {
  Connector,
  ConnectorEventMap,
  ConnectorInit,
  CreateConnectorFn,
} from "./connectors/connector";
import { type EventData, createEmitter } from "./createEmitter";
import { uid } from "./utils/uid";
import { version } from "../package.json";
import { type Storage, createStorage, noopStorage } from "./createStorage.js";
import type { Compute, ExactPartial, RemoveUndefined } from "./types/utils";
import type { Address } from "./utils/address";
import { Client } from "xrpl";
import { ChainNotConfiguredError } from "./errors/config";
import { Chain, xrplMainnet } from "./chains";

export type Config = {
  chains: Chain[];
  connectors: Connector[];
  storage: Storage;
  state: State;
  setState(value: State | ((state: State) => State)): void;
  getClient(parameters?: { chainId?: number }): Promise<Client>;
  subscribe<T>(
    selector: (state: State) => T,
    listener: (state: T, prevState: T) => void,
    options?: {
      equalityFn?: ((a: T, b: T) => boolean) | undefined;
      fireImmediately?: boolean | undefined;
    },
  ): () => void;
  _internal: {
    store: StoreApi<State>;
    ssr: boolean;
    connectors: {
      setup(connectorFn: Connector): Compute<Connector & ConnectorInit>;
      setState(
        value:
          | Compute<Connector & ConnectorInit>[]
          | ((
              state: Compute<Connector & ConnectorInit>[],
            ) => Compute<Connector & ConnectorInit>[]),
      ): void;
      subscribe<T>(listener: (state: T, prevState: T) => void): () => void;
    };
    chains: {
      setState(
        value:
          | readonly Chain[]
          | ((state: readonly Chain[]) => readonly Chain[]),
      ): void;
      subscribe(
        listener: (
          state: readonly Chain[],
          prevState: readonly Chain[],
        ) => void,
      ): () => void;
    };
    events: {
      change: (data: EventData<ConnectorEventMap, "change">) => void;
      connect: (data: EventData<ConnectorEventMap, "connect">) => void;
      disconnect: (data: EventData<ConnectorEventMap, "disconnect">) => void;
    };
  };
};

export type ConfigOptions = {
  client?: Client;
  chains?: Chain[];
  connectors: Connector[];
  storage?: Storage;
  ssr?: boolean;
};

export type State = {
  chainId: number;
  connections: Map<string, Connection>;
  current: string | null;
  status: "connected" | "connecting" | "disconnected" | "reconnecting";
};

export type PartializedState = Compute<
  ExactPartial<Pick<State, "chainId" | "connections" | "current" | "status">>
>;

export type Connection = {
  accounts: readonly [Address, ...Address[]];
  chainId: number;
  connector: Compute<Connector & ConnectorInit>;
};

export function createConfig(options: ConfigOptions): Config {
  const chains = createStore(() => options.chains ?? [xrplMainnet]);
  const connectors = createStore(() => options.connectors.map(setup));
  const {
    storage = createStorage({
      storage:
        typeof window !== "undefined" && window.localStorage
          ? window.localStorage
          : noopStorage,
    }),
    ssr = false,
  } = options;

  function setup(connectorFn: Connector): Compute<Connector & ConnectorInit> {
    // Set up emitter with uid and add to connector so they are "linked" together.
    const emitter = createEmitter<ConnectorEventMap>(uid());
    connectorFn.emitter = emitter;
    connectorFn.uid = emitter.uid;
    const connector = connectorFn as Compute<Connector & ConnectorInit>;

    // Start listening for `connect` events on connector setup
    // This allows connectors to "connect" themselves without user interaction (e.g. MetaMask's "Manually connect to current site")
    emitter.on("connect", connect);
    connector.setup?.();

    return connector;
  }

  const clients = new Map<number, Client>();
  async function getClient(config: { chainId?: number } = {}): Promise<Client> {
    const chainId = config.chainId ?? store.getState().chainId;
    const chain = chains.getState().find((x) => x.id === chainId);

    // chainId specified and not configured
    if (config.chainId && !chain) throw new ChainNotConfiguredError(chainId);

    // If the target chain is not configured, use the client of the current chain.
    type Return = Client;
    {
      const client = clients.get(store.getState().chainId);
      if (!client?.isConnected()) {
        await client?.connect();
      }
      if (client && !chain) return client as Return;
      if (!chain) throw new ChainNotConfiguredError(chainId);
    }

    // If a memoized client exists for a chain id, use that.
    {
      const client = clients.get(chainId);
      if (!client?.isConnected()) {
        await client?.connect();
      }
      if (client) return client as Return;
    }

    let client: Client;
    if (options.client) client = options.client;
    else {
      client = new Client(chain.rpc);
    }

    clients.set(chainId, client);
    if (!client?.isConnected()) {
      await client?.connect();
    }

    return client as Return;
  }

  function getInitialState(): State {
    return {
      chainId: 0,
      connections: new Map<string, Connection>(),
      current: null,
      status: "disconnected",
    };
  }

  let currentVersion: number;
  const prefix = "0.0.0-canary-";

  if (version.startsWith(prefix))
    currentVersion = Number.parseInt(version.replace(prefix, ""));
  // use package major version to version store
  else currentVersion = Number.parseInt(version.split(".")[0] ?? "0");

  const store = createStore(
    subscribeWithSelector(
      // only use persist middleware if storage exists
      storage
        ? persist(getInitialState, {
            migrate(persistedState, version) {
              if (version === currentVersion) return persistedState as State;

              const initialState = getInitialState();
              const chainId = validatePersistedChainId(
                persistedState,
                initialState.chainId,
              );
              return { ...initialState, chainId };
            },
            name: "store",
            partialize(state) {
              // Only persist "critical" store properties to preserve storage size.
              return {
                connections: {
                  __type: "Map",
                  value: Array.from(state.connections.entries()).map(
                    ([key, connection]) => {
                      const { id, name, type, uid } = connection.connector;
                      const connector = { id, name, type, uid };
                      return [key, { ...connection, connector }];
                    },
                  ),
                } as unknown as PartializedState["connections"],
                chainId: state.chainId,
                current: state.current,
              } satisfies PartializedState;
            },
            merge(persistedState, currentState) {
              // `status` should not be persisted as it messes with reconnection
              if (
                typeof persistedState === "object" &&
                persistedState &&
                "status" in persistedState
              )
                persistedState.status = undefined;
              // Make sure persisted `chainId` is valid
              const chainId = validatePersistedChainId(
                persistedState,
                currentState.chainId,
              );
              return {
                ...currentState,
                ...(persistedState as object),
                chainId,
              };
            },
            skipHydration: ssr,
            storage: storage as Storage<Record<string, unknown>>,
            version: currentVersion,
          })
        : getInitialState,
    ),
  );
  function validatePersistedChainId(
    persistedState: unknown,
    defaultChainId: number,
  ) {
    return persistedState &&
      typeof persistedState === "object" &&
      "chainId" in persistedState &&
      typeof persistedState.chainId === "number"
      ? persistedState.chainId
      : defaultChainId;
  }
  store.subscribe(
    ({ connections, current }) =>
      current ? connections.get(current)?.chainId : undefined,
    (chainId) => {
      // If chain is not configured, then don't switch over to it.
      const isChainConfigured = chains.getState().some((x) => x.id === chainId);
      if (!isChainConfigured) return;

      return store.setState((x) => ({
        ...x,
        chainId: chainId ?? x.chainId,
      }));
    },
  );
  function change(data: EventData<ConnectorEventMap, "change">) {
    store.setState((x) => {
      const connection = x.connections.get(data.uid);
      if (!connection) return x;

      return {
        ...x,
        connections: new Map(x.connections).set(data.uid, {
          accounts:
            (data.accounts as readonly [Address, ...Address[]]) ??
            connection.accounts,
          chainId: data.chainId ?? connection.chainId,
          connector: connection.connector,
        }),
      };
    });
  }
  function connect(data: EventData<ConnectorEventMap, "connect">) {
    console.log("connect", data);
    // Disable handling if reconnecting/connecting
    if (
      store.getState().status === "connecting" ||
      store.getState().status === "reconnecting"
    )
      return;

    store.setState((x) => {
      const connector = connectors.getState().find((x) => x.uid === data.uid);
      if (!connector) return x;

      if (connector.emitter?.listenerCount("connect"))
        connector.emitter?.off("connect", change);
      if (!connector.emitter?.listenerCount("change"))
        connector.emitter?.on("change", change);
      if (!connector.emitter?.listenerCount("disconnect"))
        connector.emitter?.on("disconnect", disconnect);

      return {
        ...x,
        connections: new Map(x.connections).set(data.uid, {
          accounts: data.accounts as readonly [Address, ...Address[]],
          chainId: data.chainId,
          connector: connector,
        }),
        current: data.uid,
        status: "connected",
      };
    });
  }
  function disconnect(data: EventData<ConnectorEventMap, "disconnect">) {
    store.setState((x) => {
      const connection = x.connections.get(data.uid);
      if (connection) {
        const connector = connection.connector;
        if (connector.emitter?.listenerCount("change"))
          connection.connector.emitter?.off("change", change);
        if (connector.emitter?.listenerCount("disconnect"))
          connection.connector.emitter?.off("disconnect", disconnect);
        if (!connector.emitter?.listenerCount("connect"))
          connection.connector.emitter?.on("connect", connect);
      }

      x.connections.delete(data.uid);

      if (x.connections.size === 0)
        return {
          ...x,
          connections: new Map(),
          current: null,
          status: "disconnected",
        };

      const nextConnection = x.connections.values().next().value as Connection;
      return {
        ...x,
        connections: new Map(x.connections),
        current: nextConnection.connector.uid,
      };
    });
  }

  return {
    get chains() {
      return chains.getState();
    },
    get connectors() {
      return connectors.getState();
    },
    getClient,
    storage,
    get state() {
      return store.getState() as unknown as State;
    },
    setState(value) {
      let newState: State;
      if (typeof value === "function")
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        newState = value(store.getState() as any);
      else newState = value;

      // Reset state if it got set to something not matching the base state
      const initialState = getInitialState();
      if (typeof newState !== "object") newState = initialState;
      const isCorrupt = Object.keys(initialState).some((x) => !(x in newState));
      if (isCorrupt) newState = initialState;

      store.setState(newState, true);
    },
    subscribe(selector, listener, options) {
      return store.subscribe(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        selector as unknown as (state: State) => any,
        listener,
        options
          ? ({
              ...options,
              fireImmediately: options.fireImmediately,
              // Workaround cast since Zustand does not support `'exactOptionalPropertyTypes'`
            } as RemoveUndefined<typeof options>)
          : undefined,
      );
    },

    _internal: {
      store,
      ssr: Boolean(ssr),
      connectors: {
        setup,
        setState(value) {
          return connectors.setState(
            typeof value === "function" ? value(connectors.getState()) : value,
            true,
          );
        },
        subscribe(listener) {
          //@ts-expect-error - Zustand subscribe does not support generics
          return connectors.subscribe(listener);
        },
      },
      chains: {
        setState(value) {
          const nextChains =
            typeof value === "function" ? value(chains.getState()) : value;
          if (nextChains.length === 0) return;
          return chains.setState(nextChains as Chain[], true);
        },
        subscribe(listener) {
          return chains.subscribe(listener);
        },
      },
      events: { change, connect, disconnect },
    },
  };
}

export type { Connector } from "./connectors/connector.js";
