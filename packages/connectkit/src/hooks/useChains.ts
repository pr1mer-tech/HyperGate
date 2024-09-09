import { Chain } from "@hypergate/core";
import { useConfig } from "@hypergate/react";

export function useChains() {
  const config = useConfig();
  const chains = config?.chains ?? [];
  return chains.map((c) => c) as Chain[];
}
