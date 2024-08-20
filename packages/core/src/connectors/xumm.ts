import type { BaseTransaction } from "xrpl";
import type { Address } from "../utils/address";
import type { Connector } from "./connector";
import { Xumm } from "xumm";
export class XummConnector implements Connector {
    icon = "https://raw.githubusercontent.com/pr1mer-tech/HyperGate/main/packages/ui/assets/xumm.png";
    id = "xumm";
    name = "Xaman";
    supportsSimulation = false;
    type = "xumm";

    private xumm: Xumm;

    constructor(apiKey: string) {
        this.xumm = new Xumm(apiKey);
    }

    setup?(): Promise<void> {
        return this.xumm.environment.ready;
    }
    async connect(_parameters?: { chainId?: number | undefined; isReconnecting?: boolean | undefined; } | undefined): Promise<{ accounts: readonly Address[]; chainId: number; }> {
        const authorization = await this.xumm.authorize();
        if (authorization instanceof Error) {
            throw authorization;
        }
        return {
            accounts: [authorization?.me.account as Address],
            chainId: await this.xumm.user.networkId ?? -1,
        }
    }
    disconnect(): Promise<void> {
        return this.xumm.logout();
    }
    async getAccounts(): Promise<readonly Address[]> {
        const accounts: Address[] = [];
        const userAccount = await this.xumm.user.account;
        if (userAccount) {
            accounts.push(userAccount as Address);
        }
        return accounts;
    }
    async getChainId(): Promise<number> {
        const networkId = await this.xumm.user.networkId;
        if (networkId) {
            return networkId;
        }
        return -1;
    }
    async isAuthorized(): Promise<boolean> {
        await this.xumm.environment.ready;
        return true;
    }

    registerOnAccountsChanged(callback: (accounts: string[]) => void): void {
        this.xumm.on("loggedout", () => {
            callback([]);
        });
        this.xumm.on("success", () => {
            this.xumm.user.account.then((account) => {
                callback([account as Address]);
            });
        });
    }
    registerOnChainChanged(callback: (chainId: string) => void): void {
        this.xumm.on("networkswitch", (data) => {
            callback(data.network ?? "");
        });
    }
    registerOnError(callback: (error: Error) => void): void {
        this.xumm.on("error", (data) => {
            callback(data);
        });
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