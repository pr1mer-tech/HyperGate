"use client";

import { useChainId } from "@hyper-gate/react";

export function WatchChain() {
  const chainId = useChainId();

  return (
    <div>
      <h1>Chain ID: {chainId}</h1>
    </div>
  );
}
