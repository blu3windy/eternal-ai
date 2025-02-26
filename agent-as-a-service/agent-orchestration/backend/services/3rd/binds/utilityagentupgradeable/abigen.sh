jq ".abi" UtilityAgentUpgradeable.json > UtilityAgentUpgradeable.abi
jq -r ".bytecode" UtilityAgentUpgradeable.json > UtilityAgentUpgradeable.bin
abigen --bin=UtilityAgentUpgradeable.bin --abi=UtilityAgentUpgradeable.abi --pkg=utilityagentupgradeable --type UtilityAgentUpgradeable --out=UtilityAgentUpgradeable.go
rm UtilityAgentUpgradeable.abi
rm UtilityAgentUpgradeable.bin