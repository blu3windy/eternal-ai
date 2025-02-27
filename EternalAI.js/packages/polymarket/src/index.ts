export const polymarket_ai = async (command: string, args: any) => {
    console.log(command, args);
    return {message: ""};
};

// for browser
/*export const prompt = async (prompt: string, private_key: string) => {
    try {
        const {state, tx} = await uni_swap_ai("api-infer", {
            prompt: prompt,
            private_key: private_key,
            model: "gpt-4o-mini",
            api_key: "",
            host: "https://api.openai.com/v1",
        })
        console.log(`swap tx ${JSON.stringify(tx, null, 4)} state ${state}`);
        return `Swapped with tx ${tx.transactionHash}`;
    } catch (e) {
        return `Swapped err ${e?.message}`;
    }

}

window.prompt = prompt*/
