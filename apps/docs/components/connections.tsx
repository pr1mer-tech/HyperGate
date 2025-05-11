"use client";

import { useConnections, useConnect, useDisconnect } from "@hyper-gate/react";
import { ConnectKitButton } from "@hyper-gate/connectkit";
import { Button } from "./ui/button";

// [!region account-connection]

export function AccountConnections() {
  const connections = useConnections();
  const { disconnect } = useDisconnect();

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-2">Connected Accounts</h3>

      <div className="mb-4">
        <ConnectKitButton />
      </div>

      {connections.length > 0 ? (
        <div className="space-y-3">
          {connections.map((connection) => (
            <div
              key={connection.accounts[0]}
              className="p-3 border rounded-md flex justify-between items-center"
            >
              <div>
                <div className="font-medium truncate max-w-64">
                  {connection.accounts[0]}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Connector: {connection.connector.name}
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => disconnect({ connector: connection.connector })}
              >
                Disconnect
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 italic">
          No connected accounts. Connect your wallet to get started.
        </div>
      )}
    </div>
  );
}
