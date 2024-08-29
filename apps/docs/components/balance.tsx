"use client";

import { useAccount, useAccountEffect, useBalance } from "@hypergate/react";
import { Address, formatHumanUnits, formatUnits } from "@hypergate/core";
import { useState } from "react";
import { Input } from "./ui/input";

// [!region balance]
export function GetBalance() {
  const [address, setAddress] = useState<Address | undefined | "">("");
  useAccountEffect({
    onConnect(data) {
      console.log(data);
      setAddress(data.address);
    },
  });

  const balance = useBalance({
    address: address || undefined,
  });

  if (balance.error) {
    console.error(balance.error);
  }

  return (
    <div className="flex gap-4">
      <Input
        placeholder="Address"
        className="max-w-80"
        value={address}
        onChange={(e) => setAddress(e.target.value as Address)}
      />
      <div className="min-w-24 w-auto">
        {formatHumanUnits(balance.data?.value ?? 0n, 18, 2)} XRP
      </div>
    </div>
  );
}
// [!endregion balance]
