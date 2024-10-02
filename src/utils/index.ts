import { ethers } from "ethers";

export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
  return balance;
};

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex);
  return chainIdNum;
};

export const formatAddress = (addr: string) => {
  const upperAfterLastTwo = addr.slice(0, 2) + addr.slice(2);
  return `${upperAfterLastTwo.substring(0, 5)}...${upperAfterLastTwo.substring(
    39
  )}`;
};

export const numberParser = (number: string, coin: "usdt" | "btc" | "eva") => {
  try {
    if (coin == "usdt") return ethers.parseUnits(number, 6);
    if (coin == "btc") return ethers.parseUnits(number, 8);
    if (coin == "eva") return ethers.parseUnits(number, 18);
  } catch {}
  return 0n;
};

const normalizer = (
  amount: bigint,
  fromDecimals: bigint,
  toDecimals: bigint
): bigint => {
  if (fromDecimals == toDecimals) {
    return amount;
  } else if (fromDecimals > toDecimals) {
    return amount / 10n ** (fromDecimals - toDecimals);
  } else {
    return amount * 10n ** (toDecimals - fromDecimals);
  }
};

export const evaToUsd = (
  eva: string,
  satsPerEva: bigint | undefined,
  fee: bigint | undefined,
  priceBtcUsd: number | undefined
) => {
  if (satsPerEva && fee && priceBtcUsd) {
    const btc = evaToBtc(eva, satsPerEva, fee, "buy");
    if (Number(btc) * priceBtcUsd == 0) return "0";
    return (Number(btc) * priceBtcUsd).toFixed(2).toString();
  } else return "0";
};

export const btcToUsd = (btc: string, priceBtcUsd: number | undefined) => {
  if (priceBtcUsd) {
    if (Number(btc) * priceBtcUsd == 0) return "0";
    return (Number(btc) * priceBtcUsd).toFixed(2).toString();
  } else return "0";
};

export const btcToEva = (
  btc: string,
  satsPerEva: bigint | undefined,
  fee: bigint | undefined,
  operation: "buy" | "sell"
): string => {
  if (!satsPerEva || !fee) {
    return "0";
  }

  const parsedBtc = numberParser(btc, "btc");
  const normalizedBtc = normalizer(parsedBtc, 8n, 18n);

  if (operation == "buy") {
    return ethers.formatUnits((normalizedBtc / satsPerEva) * 100000000n, 18);
  } else {
    return ethers.formatUnits(
      ((normalizedBtc / satsPerEva) * 100000000n * 1000n) / (1000n - fee),
      18
    );
  }
};

export const evaToBtc = (
  eva: string,
  satsPerEva: bigint | undefined,
  fee: bigint | undefined,
  operation: "buy" | "sell"
): string => {
  if (!satsPerEva || !fee) {
    return "0";
  }

  const parsedEva = numberParser(eva, "eva");
  const normalizedEva = normalizer(parsedEva, 18n, 8n);

  if (operation == "buy") {
    return ethers.formatUnits((normalizedEva * satsPerEva) / 100000000n, 8);
  } else {
    return ethers.formatUnits(
      (((normalizedEva * satsPerEva) / 100000000n) * (1000n - fee)) / 1000n,
      8
    );
  }
};

export const burnedEvaToBtc = (
  eva: string,
  evaTotalSupply: bigint | undefined,
  balanceWbtc: bigint | undefined
): string => {
  if (!evaTotalSupply || !balanceWbtc) {
    return "0";
  }

  const parsedEva = numberParser(eva, "eva");

  const normalizedEva = normalizer(parsedEva, 18n, 8n);
  const normalizedTotalSupply = normalizer(evaTotalSupply, 18n, 8n);

  return ethers.formatUnits(
    (normalizedEva * balanceWbtc) / normalizedTotalSupply,
    8
  );
};

export const btcToBurnedEva = (
  btc: string,
  backingRate: bigint | undefined
): string => {
  if (!backingRate) {
    return "0";
  }

  const parsedBtc = numberParser(btc, "btc");
  const normalizedBtc = normalizer(parsedBtc, 8n, 18n);

  return ethers.formatUnits(normalizedBtc * backingRate, 8n);
};

export const bigIntBalanceToFront = (
  balance: bigint | undefined,
  units: number,
  decimalsInFront: number
): string => {
  if (balance == undefined) {
    return "-";
  }

  const formattedNumber = Number(ethers.formatUnits(balance, units)).toFixed(
    decimalsInFront
  );
  if (balance == 0n) {
    return "0";
  }
  return Number(formattedNumber).toLocaleString(undefined, {
    minimumFractionDigits: decimalsInFront,
    maximumFractionDigits: decimalsInFront,
  });
};

export function formatTimestamp(timestamp: number | string) {
  if (timestamp == "") return "";

  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses empiezan en 0
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} (${hours}:${minutes}:${seconds})`;
}

export function formatTimestampMobile(timestamp: number | string) {
  if (timestamp == "") return "";

  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}/${month}/${day} - ${hours}:${minutes}:${seconds}`;
}

export const formatHash = (txHash: string) => {
  if (txHash == "") return "";
  const firstDigits = txHash.slice(0, 10);
  const lastDigits = txHash.slice(50);
  return firstDigits + " ... " + lastDigits;
};

export const formatHashMobile = (txHash: string) => {
  if (txHash == "") return "";
  const firstDigits = txHash.slice(0, 7);
  return firstDigits + "... " + ">";
};

export const calculateTimeLeft = (nextSale: number) => {
  const diferencia = nextSale - Date.now();

  const timeLeft: any = {
    days: "-",
    hours: "-",
    minutes: "-",
    seconds: "-",
  };

  if (diferencia > 0) {
    timeLeft.days = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    timeLeft.days = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    timeLeft.hours = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    timeLeft.minutes = Math.floor((diferencia / 1000 / 60) % 60);
    timeLeft.seconds = Math.floor((diferencia / 1000) % 60);
  }

  return timeLeft;
};
