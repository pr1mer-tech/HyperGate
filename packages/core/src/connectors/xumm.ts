import type { BaseTransaction } from "xrpl";
import type { Address } from "../utils/address";
import type { Connector, ConnectorEventMap } from "./connector";
import { Xumm } from "xumm";
import type { Emitter } from "../createEmitter";

export class XummConnector implements Connector {
  icon =
    "https://raw.githubusercontent.com/pr1mer-tech/HyperGate/main/packages/ui/assets/xumm.png";
  id = "xumm";
  name = "Xaman";
  supportsSimulation = false;
  type = "xumm";

  hasConnected = false;

  private xumm?: Xumm;
  emitter?: Emitter<ConnectorEventMap>;

  constructor(apiKey: string) {
    if (typeof globalThis.window === "undefined") {
      return;
    }
    this.xumm = new Xumm(apiKey);
  }

  async setup?(): Promise<void> {
    this.registerOnAccountsChanged();
    this.registerOnChainChanged();
    this.registerOnError();
    (await this.xumm?.environment.ready) ?? Promise.resolve();
  }
  async connect(
    _parameters?:
      | { chainId?: number | undefined; isReconnecting?: boolean | undefined }
      | undefined,
  ): Promise<{ accounts: readonly Address[]; chainId: number }> {
    const authorization = await this.xumm?.authorize();
    if (authorization instanceof Error) {
      throw authorization;
    }
    return {
      accounts: [authorization?.me.account as Address],
      chainId: (await this.xumm?.user.networkId) ?? -1,
    };
  }
  disconnect(): Promise<void> {
    return this.xumm?.logout() ?? Promise.resolve();
  }
  async getAccounts(): Promise<readonly Address[]> {
    const accounts: Address[] = [];
    const userAccount = await this.xumm?.user.account;
    if (userAccount) {
      accounts.push(userAccount as Address);
    }
    return accounts;
  }
  async getChainId(): Promise<number> {
    const networkId = await this.xumm?.user.networkId;
    if (networkId) {
      return networkId;
    }
    console.log("XummConnector: getChainId failed");
    return 0;
  }
  async isAuthorized(): Promise<boolean> {
    await this.xumm?.environment.ready;
    return true;
  }

  registerOnAccountsChanged(): void {
    this.xumm?.on("loggedout", () => {
      this.onAccountsChanged([]);
    });
    this.xumm?.on("success", () => {
      this.xumm?.user.account.then((account) => {
        this.onAccountsChanged([account as Address]);
      });
    });
  }
  registerOnChainChanged(): void {
    this.xumm?.on("networkswitch", (data) => {
      this.onChainChanged(data.network ?? "");
    });
  }
  registerOnError(): void {
    this.xumm?.on("error", (data) => {
      this.onError(data);
    });
  }

  onAccountsChanged(accounts: readonly Address[]): void {
    if (!this.hasConnected) {
      this.getChainId().then((chainId) => {
        this.hasConnected = true;
        this.emitter?.emit("connect", {
          chainId,
          accounts: accounts,
        });
      });
    }
    this.emitter?.emit("change", {
      accounts: accounts,
    });
  }
  onChainChanged(chainId: string): void {
    this.emitter?.emit("change", { chainId: Number(chainId) });
  }
  onError(error: Error): void {
    this.emitter?.emit("message", { type: "error", data: error });
  }

  async signTransaction(transaction: BaseTransaction): Promise<object> {
    //@ts-expect-error - TransactionType in XRPL.js is not statically typed
    const payload = await this.xumm.payload?.createAndSubscribe(transaction);
    if (!payload) {
      throw new Error("No payload returned");
    }
    return payload;
  }
}
