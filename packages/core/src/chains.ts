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
