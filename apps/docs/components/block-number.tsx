"use client";

import { useBlockNumber } from "@hyper-gate/react";

export function WatchBlockNumber() {
  const { data: blockNumber, error } = useBlockNumber();

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-2">Current Block Number</h3>
      {error ? (
        <div className="text-red-500">Error: {error.message}</div>
      ) : blockNumber ? (
        <div className="font-mono text-2xl">{blockNumber.toString()}</div>
      ) : (
        <div className="animate-pulse">Loading...</div>
      )}
    </div>
  );
}
