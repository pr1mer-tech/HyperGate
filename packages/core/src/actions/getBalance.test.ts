import { expect, test } from "bun:test";
import { Client } from "xrpl";
import { getBalance } from "./getBalance";

test("getXRPBalance - XRPL.js", async () => {
  const client = new Client("wss://xrpl.ws");
  await client.connect();
  const response = await client.request({
    command: "account_info",
    account: "rapido5rxPmP4YkMZZEeXSHqWefxHEkqv6",
  });

  expect(BigInt(response.result.account_data.Balance)).toBeGreaterThan(0n);
});

test("getTokenBalance - XRPL.js", async () => {
  const client = new Client("wss://xrpl.ws");
  await client.connect();
  const hot_balances = await client.request({
    command: "account_lines",
    account: "rapido5rxPmP4YkMZZEeXSHqWefxHEkqv6",
    ledger_index: "validated",
  });
  expect(hot_balances.result.lines).toBeInstanceOf(Array);
  expect(hot_balances.result.lines.length).toBeGreaterThan(0);
});

test("getBalance", async () => {
  const balance = await getBalance(
    {
      chains: [],
      getClient: async () => {
        const client = new Client("wss://xrpl.ws");
        await client.connect();
        return client;
      },
    },
    {
      address: "rapido5rxPmP4YkMZZEeXSHqWefxHEkqv6",
    },
  );

  expect(balance).toBeInstanceOf(Object);
  expect(balance.value).toBeTypeOf("bigint");
  expect(balance.value).toBeGreaterThan(0n);
});
