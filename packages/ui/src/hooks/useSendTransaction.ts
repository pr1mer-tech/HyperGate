"use client";

import { useMutation } from "@tanstack/react-query";
import type { SignMessageErrorType } from "@hyper-gate/core";
import type { Compute } from "@hyper-gate/core/internal";
import {
  type SignMessageData,
  type SignMessageMutate,
  type SignMessageMutateAsync,
  type SignMessageVariables,
  sendTransactionMutationOptions,
} from "@hyper-gate/core/query";

import type { ConfigParameter } from "../types/properties.js";
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from "../utils/query.js";
import { useConfig } from "./useConfig.js";

export type UseSignMessageParameters<context = unknown> = Compute<
  ConfigParameter & {
    mutation?:
      | UseMutationParameters<
          SignMessageData,
          SignMessageErrorType,
          SignMessageVariables,
          context
        >
      | undefined;
  }
>;

export type UseSignMessageReturnType<context = unknown> = Compute<
  UseMutationReturnType<
    SignMessageData,
    SignMessageErrorType,
    SignMessageVariables,
    context
  > & {
    signMessage: SignMessageMutate<context>;
    signMessageAsync: SignMessageMutateAsync<context>;
  }
>;

export function useSendTransaction<context = unknown>(
  parameters: UseSignMessageParameters<context> = {},
): UseSignMessageReturnType<context> {
  const { mutation } = parameters;

  const config = useConfig(parameters);

  const mutationOptions = sendTransactionMutationOptions(config);
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  });

  return {
    ...result,
    signMessage: mutate as SignMessageMutate<context>,
    signMessageAsync: mutateAsync as SignMessageMutateAsync<context>,
  };
}
