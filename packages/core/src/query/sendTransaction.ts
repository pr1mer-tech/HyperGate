import type { MutationOptions } from "@tanstack/query-core";

import {
  type SignMessageErrorType,
  type SignMessageParameters,
  type SignMessageReturnType,
  sendTransaction,
} from "../actions/sendTransaction.js";
import type { Config } from "../createConfig.js";
import type { Compute } from "../types/utils.js";
import type { Mutate, MutateAsync } from "./types.js";

export function sendTransactionMutationOptions(config: Config) {
  return {
    mutationFn(variables) {
      return sendTransaction(config, variables);
    },
    mutationKey: ["sendTransaction"],
  } as const satisfies MutationOptions<
    SignMessageData,
    SignMessageErrorType,
    SignMessageVariables
  >;
}

export type SignMessageData = SignMessageReturnType;

export type SignMessageVariables = Compute<SignMessageParameters>;

export type SignMessageMutate<context = unknown> = Mutate<
  SignMessageData,
  SignMessageErrorType,
  SignMessageVariables,
  context
>;

export type SignMessageMutateAsync<context = unknown> = MutateAsync<
  SignMessageData,
  SignMessageErrorType,
  SignMessageVariables,
  context
>;
