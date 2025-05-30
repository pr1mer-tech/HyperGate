"use client";

import { type GetAccountReturnType, watchAccount } from "@hyper-gate/core";
import type { Compute } from "@hyper-gate/core";
import { useEffect } from "react";

import type { ConfigParameter } from "../types/properties.js";
import { useConfig } from "./useConfig.js";

type OnConnectData = Compute<
  Pick<
    GetAccountReturnType,
    "address" | "addresses" | "chainId" | "connector"
  > & {
    isReconnected: boolean;
  }
>;
export type UseAccountEffectParameters = Compute<
  {
    // eslint-disable-next-line no-unused-vars
    onConnect?(data: OnConnectData): void;
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
            prevData.status === "connecting" ||
            prevData.status === "disconnected") &&
          data.status === "connected"
        ) {
          const { address, addresses, chainId, connector } =
            data as GetAccountReturnType;

          const isReconnected =
            prevData.status === "reconnecting" ||
            // if `previousAccount.status` is `undefined`, the connector connected immediately.
            prevData.status === undefined ||
            prevData.status === "disconnected";
          onConnect?.({
            address,
            addresses,
            chainId,
            connector,
            isReconnected,
          } as OnConnectData);
        } else if (
          prevData.status === "connected" &&
          data.status === "disconnected"
        )
          onDisconnect?.();
      },
    });
  }, [config, onConnect, onDisconnect]);
}
