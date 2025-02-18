import {ethers} from "ethers";

// Replace with your contract's ABI and address
const contractABI = [
    // Your contract's ABI here
];
const contractAddress = "0xYourContractAddress"; // Replace with your contract address

export async function callContract() {
    // Connect to the Ethereum network (e.g., using MetaMask)
    const provider = new ethers.providers.JsonRpcProvider(window.ethereum);

    // Request account access if needed
    await provider.send("eth_requestAccounts", []);

    // Get the signer (the account you want to use)
    const signer = provider.getSigner();

    // Create a contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Example: Call a read function from the contract
    const value = await contract.yourReadFunction(); // Replace with your function name
    console.log("Value from contract:", value);

    // Example: Call a write function from the contract
    const tx = await contract.yourWriteFunction(); // Replace with your function name
    await tx.wait(); // Wait for the transaction to be mined
    console.log("Transaction successful:", tx);
}