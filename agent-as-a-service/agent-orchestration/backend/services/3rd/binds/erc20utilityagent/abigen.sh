jq ".abi" ERC20UtilityAgent.json > ERC20UtilityAgent.abi
jq -r ".bytecode" ERC20UtilityAgent.json > ERC20UtilityAgent.bin
abigen --bin=ERC20UtilityAgent.bin --abi=ERC20UtilityAgent.abi --pkg=erc20utilityagent --type ERC20UtilityAgent --out=ERC20UtilityAgent.go