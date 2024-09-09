import { useConfig } from "@hypergate/react";

export function useChainIsSupported(chainId?: number): boolean | null {
  const { chains } = useConfig();
  if (!chainId) return false;
  return chains.some((x) => x.id === chainId);
}
