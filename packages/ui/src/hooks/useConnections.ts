"use client";

import {
  type GetConnectionsReturnType,
  getConnections,
  watchConnections,
} from "@hypergate/core";
import { useSyncExternalStore } from "react";

import type { ConfigParameter } from "../types/properties.js";
import { useConfig } from "./useConfig.js";

export type UseConnectionsParameters = ConfigParameter;

export type UseConnectionsReturnType = GetConnectionsReturnType;

/** https://hypergate.pr1mer.tech/docs/react/useConnections */
export function useConnections(
  parameters: UseConnectionsParameters = {},
): UseConnectionsReturnType {
  const config = useConfig(parameters);

  return useSyncExternalStore(
    (onChange) => watchConnections(config, { onChange }),
    () => getConnections(config),
    () => getConnections(config),
  );
}
