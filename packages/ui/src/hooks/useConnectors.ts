"use client";

import {
  type GetConnectorsReturnType,
  getConnectors,
  watchConnectors,
} from "@hypergate/core";
import { useSyncExternalStore } from "react";

import type { ConfigParameter } from "../types/properties.js";
import { useConfig } from "./useConfig.js";

export type UseConnectorsParameters = ConfigParameter;

export type UseConnectorsReturnType = GetConnectorsReturnType;

/** https://hypergate.pr1mer.tech/docs/react/useConnectors */
export function useConnectors(
  parameters: UseConnectorsParameters = {},
): UseConnectorsReturnType {
  const config = useConfig(parameters);

  return useSyncExternalStore(
    (onChange) => watchConnectors(config, { onChange }),
    () => getConnectors(config),
    () => getConnectors(config),
  );
}
