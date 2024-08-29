"use client";

import {
  useAccount,
  useAccountEffect,
  useConnect,
  useConnectors,
} from "@hypergate/react";
import { Button } from "./ui/button";

// [!region connect-wallet]
export function ConnectWallet() {
  const { address } = useAccount();
  const { connect } = useConnect();
  const connectors = useConnectors();
  return (
    <>
      {connectors.map((c) => (
        <Button
          className="dark:text-black"
          key={c.name}
          onClick={() =>
            connect({
              connector: c,
            })
          }
        >
          Connect {c.name}
        </Button>
      ))}
      {address && <p>Connected: {address}</p>}
    </>
  );
}
// [!endregion connect-wallet]
