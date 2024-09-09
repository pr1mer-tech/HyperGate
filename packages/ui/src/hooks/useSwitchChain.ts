"use client";

import { useMutation } from "@tanstack/react-query";
import type {
  Config,
  ResolvedRegister,
  SwitchChainErrorType,
} from "@hypergate/core";
import type { Compute } from "@hypergate/core/internal";
import {
  type SwitchChainData,
  type SwitchChainMutate,
  type SwitchChainMutateAsync,
  type SwitchChainVariables,
  switchChainMutationOptions,
} from "@hypergate/core/query";

import type { ConfigParameter } from "../types/properties.js";
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from "../utils/query.js";
import { useChains } from "./useChains.js";
import { useConfig } from "./useConfig.js";

export type UseSwitchChainParameters<
  config extends Config = Config,
  context = unknown,
> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          SwitchChainData<config, config["chains"][number]["id"]>,
          SwitchChainErrorType,
          SwitchChainVariables<config, config["chains"][number]["id"]>,
          context
        >
      | undefined;
  }
>;

export type UseSwitchChainReturnType<
  config extends Config = Config,
  context = unknown,
> = Compute<
  UseMutationReturnType<
    SwitchChainData<config, config["chains"][number]["id"]>,
    SwitchChainErrorType,
    SwitchChainVariables<config, config["chains"][number]["id"]>,
    context
  > & {
    chains: config["chains"];
    switchChain: SwitchChainMutate<config, context>;
    switchChainAsync: SwitchChainMutateAsync<config, context>;
  }
>;

/** https://hypergate.pr1mer.tech/docs/react/useSwitchChain */
export function useSwitchChain<
  config extends Config = ResolvedRegister["config"],
  context = unknown,
>(
  parameters: UseSwitchChainParameters<config, context> = {},
): UseSwitchChainReturnType<config, context> {
  const { mutation } = parameters;

  const config = useConfig(parameters);

  const mutationOptions = switchChainMutationOptions(config);
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  });

  type Return = UseSwitchChainReturnType<config, context>;
  // @ts-expect-error - context is not used in the return type
  return {
    ...result,
    chains: useChains({ config }) as unknown as config["chains"],
    switchChain: mutate as Return["switchChain"],
    switchChainAsync: mutateAsync as Return["switchChainAsync"],
  };
}
