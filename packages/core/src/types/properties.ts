import type { Config, Connector } from "../createConfig.js";

export type ChainIdParameter<config extends Config> = {
	chainId?: number | undefined;
};

export type ConnectorParameter = {
	connector?: Connector | undefined;
};

export type ScopeKeyParameter = { scopeKey?: string | undefined };

export type SyncConnectedChainParameter = {
	syncConnectedChain?: boolean | undefined;
};
