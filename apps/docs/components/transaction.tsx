"use client";

import { useTransaction } from "@hyper-gate/react";

export function FetchTransaction() {
  const { data: tx } = useTransaction({
    transaction:
      "6419BDC607366243CEA9337DDF281583183A2FF0475A19DE4452AE0B5185F06C",
  });

  return (
    <div>
      <code>{JSON.stringify(tx, null, 2)}</code>
    </div>
  );
}
