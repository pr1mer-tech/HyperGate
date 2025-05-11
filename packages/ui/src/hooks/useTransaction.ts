"use client";

import type {
  Config,
  GetTransactionErrorType,
  ResolvedRegister,
} from "@hyper-gate/core";
import type { Compute } from "@hyper-gate/core/internal";
import {
  type GetTransactionData,
  type GetTransactionOptions,
  type GetTransactionQueryFnData,
  type GetTransactionQueryKey,
  getTransactionQueryOptions,
} from "@hyper-gate/core/query";

import type { ConfigParameter, QueryParameter } from "../types/properties.js";
import { type UseQueryReturnType, useQuery } from "../utils/query.js";
import { useChainId } from "./useChainId.js";
import { useConfig } from "./useConfig.js";

export type UseTransactionParameters<
  config extends Config = Config,
  chainId extends
    config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetTransactionData<config, chainId>,
> = Compute<
  GetTransactionOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      GetTransactionQueryFnData<config>,
      GetTransactionErrorType,
      selectData,
      GetTransactionQueryKey<config, chainId>
    >
>;

export type UseTransactionReturnType<
  config extends Config = Config,
  chainId extends
    config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetTransactionData<config, chainId>,
> = UseQueryReturnType<selectData, GetTransactionErrorType>;

export function useTransaction<
  config extends Config = ResolvedRegister["config"],
  chainId extends
    config["chains"][number]["id"] = config["chains"][number]["id"],
  selectData = GetTransactionData<config, chainId>,
>(
  parameters: UseTransactionParameters<config, chainId, selectData> = {},
): UseTransactionReturnType<config, chainId, selectData> {
  const { transaction, ctid, query = {} } = parameters;

  const config = useConfig(parameters);
  const chainId = useChainId({ config });

  const options = getTransactionQueryOptions(config, {
    ...parameters,
    chainId: parameters.chainId ?? chainId,
  });
  const enabled = Boolean((transaction || ctid) && (query.enabled ?? true));

  return useQuery({
    ...(query as any),
    ...options,
    enabled,
  }) as UseTransactionReturnType<config, chainId, selectData>;
}
