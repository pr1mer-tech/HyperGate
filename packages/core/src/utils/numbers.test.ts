import { describe, test, expect } from "bun:test";
import { xrpToEth } from "./numbers"; // Adjust the import path as needed

describe("xrpToEth", () => {
  test("converts 1534965382 XRP to ETH", () => {
    const result = xrpToEth("1534965382");
    expect(result.toString()).toBe("1534965382000000000000");
  });

  test("converts 1.5 XRP to ETH", () => {
    const result = xrpToEth("1.5");
    expect(result.toString()).toBe("1500000000000");
  });

  test("converts 0.000001 XRP to ETH", () => {
    const result = xrpToEth("0.000001");
    expect(result.toString()).toBe("1000000");
  });

  test("converts 1e-6 XRP to ETH", () => {
    const result = xrpToEth("1e-6");
    expect(result.toString()).toBe("0");
  });

  test("converts 1e6 XRP to ETH", () => {
    const result = xrpToEth("1e6");
    expect(result.toString()).toBe("1000000000000000000"); // = 1
  });

  test("converts 0 XRP to ETH", () => {
    const result = xrpToEth("0");
    expect(result.toString()).toBe("0");
  });

  test("converts large number XRP to ETH", () => {
    const result = xrpToEth("123456789.123456");
    expect(result.toString()).toBe("123456789123456000000");
  });
});
