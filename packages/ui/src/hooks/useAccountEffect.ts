"use client";

import {
  Config,
  type GetAccountReturnType,
  watchAccount,
} from "@hypergate/core";
import type { Compute } from "@hypergate/core/internal";
import { useEffect } from "react";

import type { ConfigParameter } from "../types/properties.js";
import { useConfig } from "./useConfig.js";

export type UseAccountEffectParameters = Compute<
  {
    onConnect?(
      data: Compute<
        Pick<
          Extract<GetAccountReturnType, { status: "connected" }>,
          "address" | "addresses" | "chainId" | "connector"
        > & {
          isReconnected: boolean;
        }
      >,
    ): void;
    onDisconnect?(): void;
  } & ConfigParameter
>;

export function useAccountEffect(parameters: UseAccountEffectParameters = {}) {
  const { onConnect, onDisconnect } = parameters;

  const config = useConfig(parameters);

  useEffect(() => {
    return watchAccount(config, {
      onChange(data, prevData) {
        if (
          (prevData.status === "reconnecting" ||
            (prevData.status === "connecting" &&
              prevData.address === undefined)) &&
          data.status === "connected"
        ) {
          const { address, addresses, chainId, connector } = data as Extract<
            GetAccountReturnType,
            { status: "connected" }
          >;
          const isReconnected =
            prevData.status === "reconnecting" ||
            // if `previousAccount.status` is `undefined`, the connector connected immediately.
            prevData.status === undefined;
          onConnect?.({
            address,
            addresses,
            chainId,
            connector,
            isReconnected,
          });
        } else if (
          prevData.status === "connected" &&
          data.status === "disconnected"
        )
          onDisconnect?.();
      },
    });
  }, [config, onConnect, onDisconnect]);
}
