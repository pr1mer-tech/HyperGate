"use client";

import type { ResolvedRegister, State } from "@hypergate/core";
import { createContext, createElement } from "react";
import { Hydrate } from "./hydrate.js";

export const HyperGateContext = createContext<
  ResolvedRegister["config"] | undefined
>(undefined);

export type HyperGateProviderProps = {
  config: ResolvedRegister["config"];
  initialState?: State | undefined;
  reconnectOnMount?: boolean | undefined;
};

export function HyperGateProvider(
  parameters: React.PropsWithChildren<HyperGateProviderProps>,
) {
  const { children, config } = parameters;

  const props = { value: config };
  return createElement(
    Hydrate,
    parameters,
    createElement(HyperGateContext.Provider, props, children),
  );
}
