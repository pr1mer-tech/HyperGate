"use client";

import { useAccount, useConnect, useConnectors } from "@repo/ui";

export function ConnectWallet() {
  const { address } = useAccount();
  const { connect } = useConnect();
  const connectors = useConnectors();
  return (
    <>
      <button
        type="button"
        onClick={() =>
          connectors[0] &&
          connect({
            connector: connectors[0],
          })
        }
      >
        Connect Wallet
      </button>
      {address && <p>Connected: {address}</p>}
    </>
  );
}
