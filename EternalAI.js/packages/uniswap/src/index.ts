import {UniSwapABIV2, UniSwapABIV3} from "@/const";
import {swapV2} from "@/uniswap";

export const sum = (a: number, b: number) => {
    return a + b;
};

export const getUniSwapABIV2 = () => {
    return UniSwapABIV2;
}

export const getUniSwapABIV3 = () => {
    return UniSwapABIV3;
}

export const callSwapV2 = () => {
    swapV2("", "", "", "", "")
        .then(value => {
            console.log("finish")
        });
}
