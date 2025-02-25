interface EncryptParams {
    value: string;
    pass: string;
}

interface DecryptParams {
    cipherText: string;
    pass: string;
}

export type {
   EncryptParams,
   DecryptParams
}