/**
 * Converts an XRP Ledger string number to Ethereum's 18 decimal integer notation.
 * @param xrpString - The XRP Ledger string number.
 * @returns The equivalent value in Ethereum's 18 decimal integer notation as a BigInt.
 */
export function xrpToEth(xrpString: string, decimals: number = 6): bigint {
  // Define the scale difference between XRP (6 decimals) and ETH (18 decimals)
  const ethDecimals = BigInt(10 ** 18);
  const xrpDecimals = BigInt(10 ** decimals);
  const scaleFactor = ethDecimals / xrpDecimals;

  // Check if the input string is in scientific notation
  const scientificNotationMatch = xrpString.match(
    /([-+]?\d*\.?\d+)([eE][-+]?\d+)/,
  );
  if (scientificNotationMatch) {
    // Parse the base and exponent
    const base = BigInt(scientificNotationMatch[1]?.replace(".", "") ?? 0);
    const exponent = BigInt(scientificNotationMatch[2] ?? 0);

    // Calculate the number of decimal places in the base
    const decimalPlaces = BigInt(
      (scientificNotationMatch[1]?.split(".")[1] || "").length,
    );

    // Adjust the base to account for the decimal places
    const adjustedBase = base * BigInt(10n ** decimalPlaces);

    // Calculate the final value
    const value = adjustedBase * BigInt(10n ** (exponent - decimalPlaces));
    return value * scaleFactor;
  } else {
    // Handle regular decimal notation
    const parts = xrpString.split(".");
    const integerPart = BigInt(parts[0] ?? 0);
    const fractionalPart = parts[1] ? BigInt(parts[1]) : BigInt(0);
    const fractionalLength = parts[1] ? parts[1].length : 0;

    // Calculate the value in XRP drops
    const xrpValue =
      integerPart * xrpDecimals +
      fractionalPart * BigInt(10 ** (6 - fractionalLength));

    // Scale to Ethereum decimals
    return xrpValue * scaleFactor;
  }
}
