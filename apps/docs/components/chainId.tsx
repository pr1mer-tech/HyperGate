"use client";

import { useChainId } from "@hypergate/react";

export function WatchChain() {
  const chainId = useChainId();

  return (
    <div>
      <h1>Chain ID: {chainId}</h1>
    </div>
  );
}
