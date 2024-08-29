import { ErrorType } from "../errors/base";

export type FormatUnitsErrorType = ErrorType;

/**
 *  Divides a number by a given exponent of base 10 (10exponent), and formats it into a string representation of the number..
 *
 * - Docs: https://hypergate.pr1mer.tech/docs/utils/formatUnits
 *
 * @example
 * import { formatUnits } from '@hypergate/core'
 *
 * formatUnits(420000000000n, 9)
 * // '420'
 */
export function formatUnits(value: bigint, decimals: number) {
  let display = value.toString();

  const negative = display.startsWith("-");
  if (negative) display = display.slice(1);

  display = display.padStart(decimals, "0");

  let [integer, fraction] = [
    display.slice(0, display.length - decimals),
    display.slice(display.length - decimals),
  ];
  fraction = fraction.replace(/(0+)$/, "");
  return `${negative ? "-" : ""}${integer || "0"}${
    fraction ? `.${fraction}` : ""
  }`;
}

function toSuperscript(str: string) {
  const superscriptMap = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
    "+": "⁺",
    "-": "⁻",
  };

  return str
    .split("")
    .map((char) => superscriptMap[char as keyof typeof superscriptMap] || char)
    .join("");
}

/**
 * Formats a number into a human-readable string representation.
 *
 * - Docs: https://hypergate.pr1mer.tech/docs/utils/formatUnits
 *
 * @example
 * import { formatHumanUnits } from '@hypergate/core'
 *
 * formatHumanUnits(420100000000n, 9, 2)
 * // '420.1'
 */
export const formatHumanUnits = (
  n: bigint | undefined,
  baseDecimals?: number,
  decimals?: number,
): string => {
  try {
    const num = Number(formatUnits(n || 0n, baseDecimals || 0));
    if (num !== undefined && num !== null && !Number.isNaN(num)) {
      if ((num < 1e-3 && num > 1e-5) || (num > -1e-3 && num < -1e-5)) {
        // Use scientific notation for very small numbers
        return (
          new Intl.NumberFormat("en-US", {
            notation: "scientific",
            minimumFractionDigits: decimals || 0,
            maximumFractionDigits: decimals || 0,
          })
            .format(num)
            .toLowerCase()
            .split("e")
            // Superscript notation
            .map((v, i) => (i === 0 ? v : toSuperscript(v)))
            .join("×10")
        );
      }
      const isBigNumber = num > 999999;

      return new Intl.NumberFormat("en-US", {
        notation: isBigNumber ? "compact" : undefined,
        minimumFractionDigits: decimals || 0,
        maximumFractionDigits: decimals || 0,
      }).format(num);
    }
    return "--";
  } catch (error) {
    throw new Error(
      `Failed to format human units: ${error}`,
    ) as FormatUnitsErrorType;
  }
};
