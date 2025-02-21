jq ".abi" ERC20RealWorldAgent.json > ERC20RealWorldAgent.abi
jq -r ".bytecode.object" ERC20RealWorldAgent.json > ERC20RealWorldAgent.bin
abigen --bin=ERC20RealWorldAgent.bin --abi=ERC20RealWorldAgent.abi --pkg=erc20realworldagent --type ERC20RealWorldAgent --out=ERC20RealWorldAgent.go
rm ERC20RealWorldAgent.abi
rm ERC20RealWorldAgent.bin