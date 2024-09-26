"use client";

import {
  useAccount,
  useAccountEffect,
  useConnect,
  useConnectors,
} from "@hypergate/react";
import { Button } from "./ui/button";
import { ConnectKitButton } from "@hypergate/connectkit";
import { Separator } from "./ui/separator";

// [!region connect-wallet]
export function ConnectWallet() {
  const { address } = useAccount();
  const { connect } = useConnect();
  const connectors = useConnectors();
  return (
    <>
      <div className="flex items-center gap-2 w-full my-2">
        {connectors.map((c) => (
          <Button
            className="text-white dark:text-black"
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
      </div>
      {address && <p>Connected: {address}</p>}
      <div className="flex items-center gap-2 w-full my-2">
        <Separator className="w-[35%]" />
        <h1 className="text-center w-full">Or - Use ConnectKit</h1>
        <Separator className="w-[35%]" />
      </div>
      <ConnectKitButton />
    </>
  );
}
// [!endregion connect-wallet]
