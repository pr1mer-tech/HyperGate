import { useConfig } from "@hypergate/react";

export function useChainIsSupported(chainId?: number): boolean | null {
  const { chains } = useConfig();
  if (typeof chainId !== "number") return false; // Sometimes chainId is 0, which is falsy
  return chains.some((x) => x.id === Number(chainId));
}
