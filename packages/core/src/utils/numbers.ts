/**
 * Converts an XRP Ledger string number to Ethereum's 18 decimal integer notation.
 * @param xrpString - The XRP Ledger string number.
 * @param decimals - The number of decimals in the XRP string (default is 6).
 * @returns The equivalent value in Ethereum's 18 decimal integer notation as a BigInt.
 */
export function xrpToEth(xrpString: string, decimals: number = 6): bigint {
  console.log("xrpToEth", ...arguments);
  // Define the scale difference between XRP (6 decimals) and ETH (18 decimals)
  const ethDecimals = 10n ** 18n;
  const xrpDecimals = 10n ** BigInt(decimals);
  const scaleFactor = ethDecimals / xrpDecimals;

  console.log("scaleFactor", scaleFactor);

  // Check if the input string is in scientific notation
  const scientificNotationMatch = xrpString.match(
    /([-+]?\d*\.?\d+)[eE]([-+]?\d+)/,
  );

  if (scientificNotationMatch) {
    // Parse the base and exponent
    const base = BigInt(scientificNotationMatch[1]?.replace(".", "") ?? 0);
    const exponent = BigInt(scientificNotationMatch[2] ?? 0);

    // Calculate the number of decimal places in the base
    const decimalPlaces = BigInt(
      (scientificNotationMatch[1]?.split(".")[1] || "").length,
    );

    if (exponent - decimalPlaces < 0n) {
      return 0n;
    }

    // Calculate the final value
    const value = base * 10n ** (exponent - decimalPlaces);
    return value * scaleFactor;
  } else {
    // Handle regular decimal notation
    const parts = xrpString.split(".");
    const integerPart = BigInt(parts[0] ?? 0);
    const fractionalPart = parts[1] ? BigInt(parts[1]) : BigInt(0);
    const fractionalLength = parts[1] ? BigInt(parts[1].length) : 0n;

    // Calculate the value in XRP drops
    const xrpValue =
      integerPart * scaleFactor +
      (fractionalPart * scaleFactor) / 10n ** fractionalLength;

    // Scale to Ethereum decimals
    return xrpValue;
  }
}
