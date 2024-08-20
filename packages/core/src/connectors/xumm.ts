import type { Connector } from "./connector";

export class XummConnector implements Connector {
    icon?: string | undefined;
    id: string;
    name: string;
    supportsSimulation?: boolean | undefined;
    type: string;
    setup?(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    connect(parameters?: { chainId?: number | undefined; isReconnecting?: boolean | undefined; } | undefined): Promise<{ accounts: readonly `r${string}`[]; chainId: number; }> {
        throw new Error("Method not implemented.");
    }
    disconnect(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getAccounts(): Promise<readonly `r${string}`[]> {
        throw new Error("Method not implemented.");
    }
    getChainId(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getProvider(parameters?: { chainId?: number | undefined; } | undefined): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    isAuthorized(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    onAccountsChanged(accounts: string[]): void {
        throw new Error("Method not implemented.");
    }
    onChainChanged(chainId: string): void {
        throw new Error("Method not implemented.");
    }
    onConnect?(): void {
        throw new Error("Method not implemented.");
    }
    onDisconnect(error?: Error | undefined): void {
        throw new Error("Method not implemented.");
    }
    
}