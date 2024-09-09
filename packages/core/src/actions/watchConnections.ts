import type { Config } from "../createConfig.js";
import { deepEqual } from "../utils/deepEqual.js";
import {
  type GetConnectionsReturnType,
  getConnections,
} from "./getConnections.js";

export type WatchConnectionsParameters = {
  onChange(
    connections: GetConnectionsReturnType,
    prevConnections: GetConnectionsReturnType,
  ): void;
};

export type WatchConnectionsReturnType = () => void;

export function watchConnections(
  config: Config,
  parameters: WatchConnectionsParameters,
): WatchConnectionsReturnType {
  const { onChange } = parameters;
  return config.subscribe(() => getConnections(config), onChange, {
    equalityFn: deepEqual,
  });
}
