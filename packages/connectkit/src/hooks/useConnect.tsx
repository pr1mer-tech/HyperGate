/**
 * This is a wrapper around wagmi's useConnect hook that adds some
 * additional functionality.
 */

import {
  type UseConnectParameters,
  useConnect as hypergateUseConnect,
} from "@hypergate/react";
import { useContext } from "../components/ConnectKit";
import { useLastConnector } from "./useLastConnector";
import { Connector } from "@hypergate/core";

export function useConnect({ ...props }: UseConnectParameters = {}) {
  const context = useContext();

  const { connect, connectAsync, connectors, ...rest } = hypergateUseConnect({
    ...props,
    mutation: {
      ...props.mutation,
      onError(err: Error) {
        if (err.message) {
          if (err.message !== "User rejected request") {
            context.log(err.message, err);
          }
        } else {
          context.log(`Could not connect.`, err);
        }
      },
    },
  });

  return {
    connect: ({
      connector,
      chainId,
      mutation,
    }: {
      connector: Connector;
      chainId?: number;
      mutation?: UseConnectParameters["mutation"];
    }) => {
      return connect(
        {
          connector,
          chainId: chainId ?? context.options?.initialChainId,
        },
        mutation,
      );
    },
    connectAsync: async ({
      connector,
      chainId,
      mutation,
    }: {
      connector: Connector;
      chainId?: number;
      mutation?: UseConnectParameters["mutation"];
    }) => {
      return connectAsync(
        {
          connector,
          chainId: chainId ?? context.options?.initialChainId,
        },
        mutation,
      );
    },
    connectors,
    ...rest,
  };
}
