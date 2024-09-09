"use client";

import { useMutation } from "@tanstack/react-query";
import type { Connector, DisconnectErrorType } from "@hypergate/core";
import type { Compute } from "@hypergate/core/internal";
import {
  type DisconnectData,
  type DisconnectMutate,
  type DisconnectMutateAsync,
  type DisconnectVariables,
  disconnectMutationOptions,
} from "@hypergate/core/query";

import type { ConfigParameter } from "../types/properties.js";
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from "../utils/query.js";
import { useConfig } from "./useConfig.js";
import { useConnections } from "./useConnections";

export type UseDisconnectParameters<context = unknown> = Compute<
  ConfigParameter & {
    mutation?:
      | UseMutationParameters<
          DisconnectData,
          DisconnectErrorType,
          DisconnectVariables,
          context
        >
      | undefined;
  }
>;

export type UseDisconnectReturnType<context = unknown> = Compute<
  UseMutationReturnType<
    DisconnectData,
    DisconnectErrorType,
    DisconnectVariables,
    context
  > & {
    connectors: readonly Connector[];
    disconnect: DisconnectMutate<context>;
    disconnectAsync: DisconnectMutateAsync<context>;
  }
>;

/** https://hypergate.pr1mer.tech/docs/react/useDisconnect */
export function useDisconnect<context = unknown>(
  parameters: UseDisconnectParameters<context> = {},
): UseDisconnectReturnType<context> {
  const { mutation } = parameters;

  const config = useConfig(parameters);

  const mutationOptions = disconnectMutationOptions(config);
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  });

  return {
    ...result,
    connectors: useConnections({ config }).map(
      (connection) => connection.connector,
    ),
    disconnect: mutate as DisconnectMutate<context>,
    disconnectAsync: mutateAsync as DisconnectMutateAsync<context>,
  } as UseDisconnectReturnType<context>;
}
