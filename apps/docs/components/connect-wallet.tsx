"use client";

import { useAccount, useConnect, useConnectors } from "@hypergate/react";
import { Button } from "./ui/button";

export function ConnectWallet() {
  const { address } = useAccount();
  const { connect } = useConnect();
  const connectors = useConnectors();
  return (
    <>
      <Button
        className="dark:text-black"
        onClick={() =>
          connectors[0] &&
          connect({
            connector: connectors[0],
          })
        }
      >
        Connect Wallet
      </Button>
      {address && <p>Connected: {address}</p>}
    </>
  );
}
