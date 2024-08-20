import { BaseTransaction } from "xrpl"
import type { Address } from "../utils/address"

export type Connector<
provider = unknown
> = {
    readonly icon?: string | undefined
    readonly id: string
    readonly name: string
    readonly supportsSimulation?: boolean | undefined
    readonly type: string

    setup?(): Promise<void>
    connect(
      parameters?:
        | { chainId?: number | undefined; isReconnecting?: boolean | undefined }
        | undefined,
    ): Promise<{
      accounts: readonly Address[]
      chainId: number
    }>
    disconnect(): Promise<void>
    getAccounts(): Promise<readonly Address[]>
    getChainId(): Promise<number>
    isAuthorized(): Promise<boolean>

    registerOnAccountsChanged(callback: (accounts: string[]) => void): void
    registerOnChainChanged(callback: (chainId: string) => void): void
    registerOnError(callback: (error: Error) => void): void

    // Actions such as signing transactions, sending messages, etc.
    signTransaction(transaction: BaseTransaction): Promise<object>
  }