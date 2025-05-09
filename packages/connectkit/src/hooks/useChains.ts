import { Chain } from "@hyper-gate/core";
import { useConfig } from "@hyper-gate/react";

export function useChains() {
  const config = useConfig();
  const chains = config?.chains ?? [];
  return chains.map((c) => c) as Chain[];
}
