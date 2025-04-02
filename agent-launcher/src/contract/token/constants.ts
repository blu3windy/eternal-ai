import { compareString } from "@utils/string";

export const NATIVE_TOKEN_LIST = [
  "0x0000000000000000000000000000000000000000",
  "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  "0x4200000000000000000000000000000000000006",
];

export const isNativeToken = (tokenAddress: string) => {
  return NATIVE_TOKEN_LIST.some((address) =>
    compareString(address, tokenAddress)
  );
};

export const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";
