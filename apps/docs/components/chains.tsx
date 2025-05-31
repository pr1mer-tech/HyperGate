"use client";

import { useChains } from "@hyper-gate/react";
import type { Chain } from "@hyper-gate/core";

export function AvailableChains() {
  const chains = useChains();

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-2">Available Chains</h3>
      {chains.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {chains.map((chain: Chain) => (
            <div key={chain.id} className="p-3 border rounded-md">
              <div className="font-medium">{chain.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                ID: {chain.id}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="animate-pulse">Loading chains...</div>
      )}
    </div>
  );
}
