jq ".abi" RealWorldAgentUpgradeable.json > RealWorldAgentUpgradeable.abi
jq -r ".bytecode.object" RealWorldAgentUpgradeable.json > RealWorldAgentUpgradeable.bin
abigen --bin=RealWorldAgentUpgradeable.bin --abi=RealWorldAgentUpgradeable.abi --pkg=realworldagentupgradeable --type RealWorldAgentUpgradeable --out=RealWorldAgentUpgradeable.go
rm RealWorldAgentUpgradeable.abi
rm RealWorldAgentUpgradeable.bin