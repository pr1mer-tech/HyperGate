"use client";

import type {
  Config,
  GetBalanceErrorType,
  ResolvedRegister,
} from "@hyper-gate/core";
import type { Compute } from "@hyper-gate/core";
import {
  type GetBalanceData,
  type GetBalanceOptions,
  type GetBalanceQueryKey,
  getBalanceQueryOptions,
} from "@hyper-gate/core";
import type { GetBalanceQueryFnData } from "@hyper-gate/core";

import type { ConfigParameter, QueryParameter } from "../types/properties.js";
import { type UseQueryReturnType, useQuery } from "../utils/query.js";
import { useChainId } from "./useChainId.js";
import { useConfig } from "./useConfig.js";

export type UseBalanceParameters<
  config extends Config = Config,
  selectData = GetBalanceData,
> = Compute<
  GetBalanceOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      GetBalanceQueryFnData,
      GetBalanceErrorType,
      selectData,
      GetBalanceQueryKey<config>
    >
>;

export type UseBalanceReturnType<selectData = GetBalanceData> =
  UseQueryReturnType<selectData, GetBalanceErrorType>;

/** https://hypergate.pr1mer.tech/docs/react/useBalance */
export function useBalance<
  config extends Config = ResolvedRegister["config"],
  selectData = GetBalanceData,
>(parameters: UseBalanceParameters<config, selectData> = {}) {
  const { address, query = {} } = parameters;

  const config = useConfig(parameters);
  const chainId = useChainId({ config });

  const options = getBalanceQueryOptions(config, {
    ...parameters,
    chainId: parameters.chainId ?? chainId,
  });
  const enabled = Boolean(address && (query.enabled ?? true));

  return useQuery({ ...query, ...options, enabled });
}
