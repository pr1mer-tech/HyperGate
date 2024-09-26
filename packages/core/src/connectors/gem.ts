import type { BaseTransaction } from "xrpl";
import type { Address } from "../utils/address";
import type {
  Connector,
  ConnectorEventMap,
  ConnectorProvider,
} from "./connector";
import type { Emitter } from "../createEmitter";

export class GemConnector implements Connector {
  icon =
    "https://raw.githubusercontent.com/pr1mer-tech/HyperGate/main/packages/ui/assets/gem.png";
  id = "gem";
  name = "GemWallet";
  supportsSimulation = false;
  type = "injected";
  provider = { type: "injected" } as ConnectorProvider;

  hasConnected = false;
  emitter?: Emitter<ConnectorEventMap>;
  private Gem?: typeof import("@gemwallet/api");

  constructor() {
    if (typeof window === "undefined") {
      return;
    }
    this.initializeGem();
  }

  private async initializeGem(): Promise<void> {
    if (typeof window !== "undefined") {
      this.Gem = await import("@gemwallet/api");
    }
  }

  async setup?(): Promise<void> {
    await this.initializeGem(); // Ensure Gem is loaded
    this.registerOnAccountsChanged();
    this.registerOnChainChanged();
    const hasGem = await this.Gem?.isInstalled();
    if (!hasGem?.result?.isInstalled) {
      return;
    }
  }

  async connect(
    _parameters?:
      | { chainId?: number | undefined; isReconnecting?: boolean | undefined }
      | undefined,
  ): Promise<{ accounts: readonly Address[]; chainId: number }> {
    const accounts = await this.getAccounts();
    const chainId = await this.getChainId();
    return {
      accounts,
      chainId,
    };
  }

  disconnect(): Promise<void> {
    return Promise.resolve(); // Gem doesn't have a disconnect method
  }

  async getAccounts(): Promise<readonly Address[]> {
    const accounts: Address[] = [];
    const userAccount = await this.Gem?.getAddress();
    if (userAccount?.result?.address) {
      accounts.push(userAccount.result.address as Address);
    }
    return accounts;
  }

  async getChainId(): Promise<number> {
    const networkId = await this.Gem?.getNetwork();
    switch (networkId?.result?.chain) {
      case "XRPL":
        return networkId.result.network === "Mainnet" ? 0 : 1;
      default:
        break;
    }
    console.log("GemConnector: getChainId failed");
    return 0;
  }

  async isAuthorized(): Promise<boolean> {
    const result = await this.Gem?.isInstalled();
    return result?.result?.isInstalled ?? false;
  }

  registerOnAccountsChanged(): void {
    this.Gem?.on("logout", (response) => {
      response?.loggedIn === false && this.onAccountsChanged([]);
    });
    this.Gem?.on("walletChanged", (response) => {
      response?.wallet?.publicAddress &&
        this.onAccountsChanged([response.wallet.publicAddress as Address]);
    });
  }

  registerOnChainChanged(): void {
    this.Gem?.on("networkChanged", () => {
      this.getChainId().then((chainId) =>
        this.onChainChanged(chainId.toString()),
      );
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
    const payload = await this.Gem?.signTransaction(transaction);
    if (!payload?.result?.signature) {
      throw new Error("No payload returned");
    }
    return payload.result;
  }

  async switchChain(parameters: { chainId: number }): Promise<{ id: number }> {
    throw new Error("Method not implemented.");
  }
}
