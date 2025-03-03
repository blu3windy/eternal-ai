jq ".abi" AgentUpgradeable.json > AgentUpgradeable.abi
jq -r ".bytecode" AgentUpgradeable.json > AgentUpgradeable.bin
abigen --bin=AgentUpgradeable.bin --abi=AgentUpgradeable.abi --pkg=agentupgradeable --type AgentUpgradeable --out=AgentUpgradeable.go
rm AgentUpgradeable.abi
rm AgentUpgradeable.bin