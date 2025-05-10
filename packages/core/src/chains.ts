export type Chain = {
  id: number;
  name?: string;
  rpc: string;
  explorer?: string;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  formatters?: ChainFormatters;
};
export type ChainFormatters = {
  /** Modifies how the Block structure is formatted & typed. */
  block?: ChainFormatter<"block"> | undefined;
  /** Modifies how the Transaction structure is formatted & typed. */
  transaction?: ChainFormatter<"transaction"> | undefined;
  /** Modifies how the TransactionReceipt structure is formatted & typed. */
  transactionReceipt?: ChainFormatter<"transactionReceipt"> | undefined;
  /** Modifies how the TransactionRequest structure is formatted & typed. */
  transactionRequest?: ChainFormatter<"transactionRequest"> | undefined;
};

export type ChainFormatter<type extends string = string> = {
  format: (args: any) => any;
  type: type;
};

export const xrplMainnet: Chain = {
  id: 0,
  rpc: "wss://xrpl.ws",
  explorer: "https://xrpscan.com",
  name: "XRPL Mainnet",
  nativeCurrency: {
    name: "XRP",
    decimals: 6,
    symbol: "XRP",
  },
} as const;
