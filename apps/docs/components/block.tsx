"use client";

import { useBlock } from "@hypergate/react";

export function WatchLedger() {
  const { data: block } = useBlock();

  return (
    <div>
      <h1>Block: {block?.ledger_index}</h1>
      <p>Hash: {block?.ledger_hash}</p>
      <p>Timestamp: {block?.ledger_time}</p>
    </div>
  );
}
