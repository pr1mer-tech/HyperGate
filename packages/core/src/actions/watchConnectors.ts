import type { Config } from "../createConfig.js";
import type { GetConnectorsReturnType } from "./getConnectors.js";

export type WatchConnectorsParameters = {
  onChange(
    connections: GetConnectorsReturnType,
    prevConnectors: GetConnectorsReturnType,
  ): void;
};

export type WatchConnectorsReturnType = () => void;

export function watchConnectors(
  config: Config,
  parameters: WatchConnectorsParameters,
): WatchConnectorsReturnType {
  const { onChange } = parameters;
  return config._internal.connectors.subscribe((connectors, prevConnectors) => {
    const connectorsArray = Object.values(
      connectors as Record<string, unknown>,
    ) as GetConnectorsReturnType;
    const prevConnectorsArray = prevConnectors as GetConnectorsReturnType;
    onChange(connectorsArray, prevConnectorsArray);
  });
}
