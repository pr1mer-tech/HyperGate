import type { BaseTransaction } from "xrpl";
import type { Address } from "../utils/address";
import type { Emitter } from "../createEmitter";
import type { Compute } from "../types/utils";

export type ConnectorEventMap = {
  change: {
    accounts?: readonly Address[] | undefined;
    chainId?: number | undefined;
  };
  connect: { accounts: readonly Address[]; chainId: number };
  disconnect: never;
  error: { error: Error };
  message: { type: string; data?: unknown | undefined };
};

export type Connector = {
  readonly icon?: string | undefined;
  readonly id: string;
  readonly name: string;
  readonly supportsSimulation?: boolean | undefined;
  readonly type: string;

  emitter?: Emitter<ConnectorEventMap>;
  uid?: string;

  setup?(): Promise<void>;
  connect(
    parameters?:
      | { chainId?: number | undefined; isReconnecting?: boolean | undefined }
      | undefined,
  ): Promise<{
    accounts: readonly Address[];
    chainId: number;
  }>;
  disconnect(): Promise<void>;
  getAccounts(): Promise<readonly Address[]>;
  getChainId(): Promise<number>;
  isAuthorized(): Promise<boolean>;

  onAccountsChanged(accounts: readonly Address[]): void;
  onChainChanged(chainId: string): void;
  onError(error: Error): void;

  // Actions such as signing transactions, sending messages, etc.
  signTransaction(transaction: BaseTransaction): Promise<object>;
  switchChain(parameters: { chainId: number }): Promise<{ id: number }>;
};

export type ConnectorInit = {
  uid: string;
  emitter: Emitter<ConnectorEventMap>;
};
export type CreateConnectorFn<arguments> = (
  init: ConnectorInit,
  ...args: arguments[]
) => Compute<Connector & ConnectorInit>;
