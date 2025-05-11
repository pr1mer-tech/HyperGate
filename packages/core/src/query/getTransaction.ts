import type { QueryOptions } from "@tanstack/query-core";

import {
  type GetTransactionErrorType,
  type GetTransactionParameters,
  type GetTransactionReturnType,
  getTransaction,
} from "../actions/getTransaction.js";
import type { Config } from "../createConfig.js";
import type { ScopeKeyParameter } from "../types/properties.js";
import type { Compute, ExactPartial } from "../types/utils.js";
import { filterQueryOptions } from "./utils.js";

export type GetTransactionOptions<config extends Config> = Compute<
  ExactPartial<GetTransactionParameters<config>> & ScopeKeyParameter
>;

export function getTransactionQueryOptions<
  config extends Config,
  chainId extends config["chains"][number]["id"],
>(config: config, options: GetTransactionOptions<config> = {}) {
  return {
    async queryFn({ queryKey }) {
      const { transaction, ctid } = queryKey[1];
      if (!transaction && !ctid)
        throw new Error(
          "transaction, or ctid, is required for transaction queries",
        );
      const { scopeKey: _, ...rest } = queryKey[1];
      return getTransaction(config, rest as GetTransactionParameters);
    },
    queryKey: getTransactionQueryKey(options),
  } as const satisfies QueryOptions<
    GetTransactionQueryFnData<config>,
    GetTransactionErrorType,
    GetTransactionData<config, chainId>,
    GetTransactionQueryKey<config, chainId>
  >;
}

export type GetTransactionQueryFnData<config extends Config> =
  GetTransactionReturnType;

export type GetTransactionData<
  config extends Config,
  chainId extends config["chains"][number]["id"],
> = GetTransactionQueryFnData<config>;

export function getTransactionQueryKey<
  config extends Config,
  chainId extends config["chains"][number]["id"],
>(options: GetTransactionOptions<config> = {}) {
  return ["transaction", filterQueryOptions(options)] as const;
}

export type GetTransactionQueryKey<
  config extends Config,
  chainId extends config["chains"][number]["id"],
> = ReturnType<typeof getTransactionQueryKey<config, chainId>>;
