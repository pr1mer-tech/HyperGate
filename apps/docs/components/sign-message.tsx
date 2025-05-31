"use client";

import { useSendTransaction, useAccount } from "@hyper-gate/react";
import { ConnectKitButton } from "@hyper-gate/connectkit";
import { useState } from "react";
import { Button } from "./ui/button";

// [!region sign-message]
export function SignMessageDemo() {
  const { address, isConnected } = useAccount();
  const [signedResult, setSignedResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    signMessage,
    isPending,
    isError,
    error: signError,
  } = useSendTransaction({
    mutation: {
      onSuccess: (data) => {
        setSignedResult(data);
        setError(null);
      },
      onError: (error) => {
        setError(error.message);
        setSignedResult(null);
        console.error(error);
      },
    },
  });

  const dummyTransaction = {
    TransactionType: "Payment" as const,
    Destination: "r4DVHyEisbgQRAXCiMtP2xuz5h3dDkwqf1" as const,
    Amount: String(1000000), // one million drops, 1 XRP
  };

  const handleSignMessage = () => {
    if (!address) return;

    setError(null);
    setSignedResult(null);

    signMessage({ ...dummyTransaction, Account: address });
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">useSendTransaction Demo</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sign a dummy XRP payment transaction
          </p>
        </div>
        <ConnectKitButton />
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Transaction to Sign:</h4>
          <div className="bg-gray-50 dark:bg-gray-900 rounded p-3">
            <pre className="text-xs text-gray-700 dark:text-gray-300">
              {JSON.stringify(dummyTransaction, null, 2)}
            </pre>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSignMessage}
            disabled={!isConnected || isPending}
            className="flex-shrink-0"
          >
            {isPending ? "Signing..." : "Sign Transaction"}
          </Button>
          {!isConnected && (
            <p className="text-sm text-gray-500">
              Connect your wallet to sign the transaction
            </p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded">
            <p className="text-sm text-red-700 dark:text-red-300">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {signedResult && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Signed Transaction Blob:</h4>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded p-3">
              <p className="text-xs font-mono text-green-700 dark:text-green-300 break-all">
                {signedResult}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// [!endregion]
