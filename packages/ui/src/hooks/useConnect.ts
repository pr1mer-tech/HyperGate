"use client";

import { useMutation } from "@tanstack/react-query";
import type {
  Config,
  ConnectErrorType,
  ResolvedRegister,
} from "@hypergate/core";
import type { Compute } from "@hypergate/core/internal";
import {
  type ConnectData,
  type ConnectMutate,
  type ConnectMutateAsync,
  type ConnectVariables,
  connectMutationOptions,
} from "@hypergate/core/query";
import { useEffect } from "react";

import type { ConfigParameter } from "../types/properties.js";
import type {
  UseMutationParameters,
  UseMutationReturnType,
} from "../utils/query.js";
import { useConfig } from "./useConfig.js";
import {
  type UseConnectorsReturnType,
  useConnectors,
} from "./useConnectors.js";

export type UseConnectParameters<
  config extends Config = Config,
  context = unknown,
> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          ConnectData<config>,
          ConnectErrorType,
          ConnectVariables<config>,
          context
        >
      | undefined;
  }
>;

export type UseConnectReturnType<
  config extends Config = Config,
  context = unknown,
> = Compute<
  UseMutationReturnType<
    ConnectData<config>,
    ConnectErrorType,
    ConnectVariables<config>,
    context
  > & {
    connect: ConnectMutate<config, context>;
    connectAsync: ConnectMutateAsync<config, context>;
    connectors: Compute<UseConnectorsReturnType>;
  }
>;

/** https://hypergate.pr1mer.tech/docs/react/useConnect */
export function useConnect<
  config extends Config = ResolvedRegister["config"],
  context = unknown,
>(
  parameters: UseConnectParameters<config, context> = {},
): UseConnectReturnType<config, context> {
  const { mutation } = parameters;

  const config = useConfig(parameters);

  const mutationOptions = connectMutationOptions(config);
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    ...mutationOptions,
  });

  // Reset mutation back to an idle state when the connector disconnects.
  useEffect(() => {
    return config.subscribe(
      ({ status }) => status,
      (status, previousStatus) => {
        if (previousStatus === "connected" && status === "disconnected")
          result.reset();
      },
    );
  }, [config, result.reset]);

  //@ts-expect-error - undefined cannot be unknown?
  return {
    ...result,
    connect: mutate as unknown as ConnectMutate<config, context>,
    connectAsync: mutateAsync as unknown as ConnectMutateAsync<config, context>,
    connectors: useConnectors({ config }),
  };
}
