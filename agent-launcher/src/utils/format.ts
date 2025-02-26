import { compareString } from "./string";

export const abbreviateNumber = (
  value: any,
  minimumFractionDigits: number,
  significantDigits?: boolean
) => {
  const config: any = {
    notation: "compact",
    compactDisplay: "short",
    maximumSignificantDigits: significantDigits ? 3 : undefined,
    maximumFractionDigits: 2,
    minimumFractionDigits,
  };
  const result = new Intl.NumberFormat("en-US", config);
  return result.format(value);
};

export const formatCurrency = (
  value: any = 0,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
  symbol = "EAI",
  hideAbbr = false,
  showZero = true,
  significantDigits = true
): string => {
  if (isNaN(Number(value)) || Number(value) === 0 || !value) return "0";

  let config: any = {
    maximumFractionDigits: maximumFractionDigits,
    minimumFractionDigits: minimumFractionDigits,
  };

  if (!showZero && (Number(value) === 0 || !value)) {
    return "-";
  }

  if (Number(value) < 1) {
    if (compareString(symbol, "BTC")) {
      config = {
        maximumFractionDigits: 6,
        minimumFractionDigits: 0,
      };
    } else {
      if (Number(value) < 0.001) {
        config = {
          maximumFractionDigits: 7,
          minimumFractionDigits: 0,
        };
      } else {
        config = {
          maximumFractionDigits: maximumFractionDigits,
          minimumFractionDigits: minimumFractionDigits,
        };
      }
    }
  } else if (Number(value) >= 1 && Number(value) < 1000) {
    config = {
      maximumFractionDigits: maximumFractionDigits,
      minimumFractionDigits: minimumFractionDigits,
    };
  } else if (Number(value) >= 1000 && !hideAbbr) {
    return abbreviateNumber(value, minimumFractionDigits, significantDigits);
  } else if (Number(value) >= 1000) {
    config = {
      maximumFractionDigits: maximumFractionDigits,
      minimumFractionDigits: minimumFractionDigits,
    };
  }

  const result = new Intl.NumberFormat("en-US", config);
  return result.format(value);
};

export const formatLongAddress = (address?: string): string => {
  if (!address) return '';
  if (address.length < 14) return address;
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4,
    address.length,
  )}`;
};
