import { getParsedEthersError } from "@enzoferey/ethers-error-parser";
import { ErrorMessage } from "./error-message";
import { compareString } from "./string";

const ERROR_CODE = {
  DECRYPT: "0",
  CREATE_WALLET: "1",
  INSUFFICIENT_FUNDS_FOR_GAS: "INSUFFICIENT_FUNDS_FOR_GAS",
  UNPREDICTABLE_GAS_LIMIT: "UNPREDICTABLE_GAS_LIMIT",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  AKF_BBP: "AKF_BBP",
  INVALID_HASH: "invalid hash",
  AKF_IBB: "AKF_IBB",
  INVALID_ARGUMENT: "INVALID_ARGUMENT",
  ENOUGH_BTC_BUY_TC: "TransferHelper::transferFrom: transferFrom failed",
  AKT_IK: "AKT_IK",
  NM_IP: "NM_IP",
  PT_NEF: "PT_NEF",
  SOMETHING: "STW",
  WALLET_EXISTED: "WE",
  WALLET_LOADED: "WL",
  WALLET_IMPORT: "WI",
};

const ERROR_MESSAGE = {
  [ERROR_CODE.DECRYPT]: {
    message: "Incorrect password.",
    desc: "Incorrect password.",
  },
  [ERROR_CODE.CREATE_WALLET]: {
    message: "Create wallet error.",
    desc: "Create wallet error.",
  },
  [ERROR_CODE.INSUFFICIENT_FUNDS_FOR_GAS]: {
    message: "Insufficient network fee. Join our discord for further support.",
    desc: "Insufficient network fee. Join our discord for further support.",
  },
  [ERROR_CODE.UNKNOWN_ERROR]: {
    message: "Some thing went wrong. Try again",
    desc: "Some thing went wrong. Try again",
  },
  [ERROR_CODE.AKF_BBP]: {
    message: "The key's price has changed. Please try again.",
    desc: "The key's price has changed. Please try again.",
  },
  [ERROR_CODE.NM_IP]: {
    message: "Invalid supply.",
    desc: "Invalid supply.",
    code: ERROR_CODE.NM_IP,
  },
  [ERROR_CODE.AKF_IBB]: {
    message: `Insufficient balance to complete the transaction`,
    desc: `Insufficient balance to complete the transaction.`,
    url: "deposit",
    linkText: "Deposit more.",
  },
  [ERROR_CODE.ENOUGH_BTC_BUY_TC]: {
    message: `Insufficient balance to complete the transaction`,
    desc: `Insufficient balance to complete the transaction.`,
    url: "deposit",
    linkText: "Deposit more.",
  },
  [ERROR_CODE.AKT_IK]: {
    message: `Enough key balance for sell`,
    desc: `Enough key balance for sell`,
  },
  [ERROR_CODE.PT_NEF]: {
    message: "Sub has closed",
    desc: "Sub has closed",
  },
  [ERROR_CODE.SOMETHING]: {
    message: "Something went wrong. Please try again later.",
    desc: "Something went wrong. Please try again later.",
  },
  [ERROR_CODE.WALLET_EXISTED]: {
    message: "Wallet existed",
    desc: "Wallet existed.",
  },
  [ERROR_CODE.WALLET_LOADED]: {
    message: "Load wallet error.",
    desc: "Load wallet error.",
  },
  [ERROR_CODE.WALLET_IMPORT]: {
    message: "Import wallet error.",
    desc: "Import wallet error.",
  },
};

class ErrorHelper extends Error {
  message: string;

  code: string;

  desc: string;

  constructor(code: string, desc?: string) {
    super();
    // eslint-disable-next-line no-underscore-dangle
    const _error = ERROR_MESSAGE[code];
    this.message = `${_error?.message || ""} (${code})` || "";
    this.code = code;
    this.desc = desc || _error?.desc || "";
  }

  getMessage() {
    return this.message;
  }
}

const getErrorMessageContract = (error: any) => {
  const parsedEthersError = getParsedEthersError(error);

  let errorCode: any = parsedEthersError?.errorCode;

  const unknownError = compareString(
    parsedEthersError?.errorCode,
    ERROR_CODE.UNKNOWN_ERROR
  );

  const invalidArgumentError = compareString(
    parsedEthersError?.errorCode,
    ERROR_CODE.INVALID_HASH
  );

  const invalidSupply = compareString(
    parsedEthersError?.context,
    ERROR_CODE.NM_IP
  );

  if (unknownError || invalidArgumentError || invalidSupply) {
    const AKF_BBP = error?.message?.includes?.(ERROR_CODE.AKF_BBP);
    const INVALID_HASH = error?.message?.includes?.(ERROR_CODE.INVALID_HASH);
    const NM_IP = error?.message?.includes?.(ERROR_CODE.NM_IP);
    if (AKF_BBP || INVALID_HASH) {
      errorCode = ERROR_CODE.AKF_BBP;
    }
    if (NM_IP) {
      errorCode = ERROR_CODE.NM_IP;
    }
    const AKF_IBB = error?.message?.includes?.(ERROR_CODE.AKF_IBB);
    if (AKF_IBB) {
      errorCode = ERROR_CODE.AKF_IBB;
    }
    const ENOUGH_BTC_BUY_TC = error?.message?.includes?.(
      ERROR_CODE.ENOUGH_BTC_BUY_TC
    );
    if (ENOUGH_BTC_BUY_TC) {
      errorCode = ERROR_CODE.ENOUGH_BTC_BUY_TC;
    }
    const AKT_IK = error?.message?.includes?.(ERROR_CODE.AKT_IK);
    if (AKT_IK) {
      errorCode = ERROR_CODE.AKT_IK;
    }
    const PT_NEF = error?.message?.includes?.(ERROR_CODE.PT_NEF);
    if (PT_NEF) {
      errorCode = ERROR_CODE.PT_NEF;
    }

    if (invalidSupply) {
      errorCode = ERROR_CODE.NM_IP;
    }
  }

  return ERROR_MESSAGE?.[errorCode] || errorCode;
};

const getErrorMessage = (error: unknown) => {
  let message = "Something went wrong. Please try again later.";
  let desc = "";
  if (error instanceof ErrorHelper) {
    message = error.getMessage();
    desc = `${error.desc}(${error.code})`;
  } else if (error instanceof Error && error.message) {
    message = error.message;
    desc = error.message;
    const etherError = getErrorMessageContract(error);

    if (etherError && typeof etherError === "string") {
      message =
        etherError || ERROR_MESSAGE?.[ERROR_CODE.SOMETHING]?.message || "";
      desc = etherError || ERROR_MESSAGE?.[ERROR_CODE.SOMETHING]?.message || "";
    } else if (
      etherError &&
      typeof etherError === "object" &&
      typeof etherError?.message === "string"
    ) {
      message = etherError?.message || "";
      desc = etherError?.message || "";
    }
  }

  return {
    message: `${message}`,
    desc: `${desc}`,
  };
};

export interface IError {
  message: string;
  code: number;
}

export const getError = (err: unknown): IError => {
  const randomCode = Math.floor(Math.random() * 100);
  let _err: IError;
  if (typeof err === "string") {
    _err = {
      message: err,
      code: randomCode,
    };
  } else if (
    !!err &&
    typeof err === "object" &&
    "message" in err &&
    typeof err.message === "string"
  ) {
    const errCode =
      "code" in err &&
      (typeof err.code === "number" || typeof err.code === "string")
        ? err.code
        : randomCode;
    _err = {
      message: err.message,
      code: Number(errCode),
    };
  } else {
    _err = {
      message: JSON.stringify(err || ErrorMessage.DEFAULT),
      code: randomCode,
    };
  }
  return _err;
};

export { getErrorMessage };

export default ErrorHelper;
