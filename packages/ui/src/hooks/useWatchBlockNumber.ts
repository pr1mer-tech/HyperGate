"use client";

import {
  type Config,
  type ResolvedRegister,
  type WatchBlockNumberParameters,
  watchBlockNumber,
} from "@hypergate/core";
import type { UnionCompute, UnionExactPartial } from "@hypergate/core/internal";
import { useEffect } from "react";

import type { ConfigParameter, EnabledParameter } from "../types/properties.js";
import { useChainId } from "./useChainId.js";
import { useConfig } from "./useConfig.js";

export type UseWatchBlockNumberParameters<config extends Config = Config> =
  UnionCompute<
    UnionExactPartial<WatchBlockNumberParameters<config>> &
      ConfigParameter<config> &
      EnabledParameter
  >;

export type UseWatchBlockNumberReturnType = void;

/** https://hypergate.pr1mer.tech/docs/react/useWatchBlockNumber */
export function useWatchBlockNumber<
  config extends Config = ResolvedRegister["config"],
>(
  parameters: UseWatchBlockNumberParameters<config> = {} as any,
): UseWatchBlockNumberReturnType {
  const { enabled = true, onBlockNumber, config: _, ...rest } = parameters;

  const config = useConfig(parameters);
  const configChainId = useChainId({ config });
  const chainId = parameters.chainId ?? configChainId;

  // TODO(react@19): cleanup
  // biome-ignore lint/correctness/useExhaustiveDependencies: `rest` changes every render so only including properties in dependency array
  useEffect(() => {
    if (!enabled) return;
    if (!onBlockNumber) return;
    const unwatch = watchBlockNumber(config, {
      ...(rest as any),
      chainId,
      onBlockNumber,
    });

    return () => {
      unwatch.then((unwatchFn) => unwatchFn?.());
    };
  }, [
    chainId,
    config,
    enabled,
    onBlockNumber,
    ///
    rest.blockNumber,
    rest.blockNumber,
    rest.syncConnectedChain,
  ]);
}
