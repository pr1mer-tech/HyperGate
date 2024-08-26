import type { Connector } from "../connectors/connector.js";
import type { Config } from "../createConfig.js";
import { deepEqual } from "../utils/deepEqual.js";

export type GetConnectorsReturnType = readonly Connector[];

let previousConnectors: readonly Connector[] = [];

export function getConnectors(config: Config): GetConnectorsReturnType {
  const connectors = config.connectors;
  if (deepEqual(previousConnectors, connectors)) return previousConnectors;
  previousConnectors = connectors;
  return connectors;
}
