package ethapi

import (
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/helpers"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services/3rd/binds/agentupgradeable"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
)

// func (c *Client) DeployAgentUpgradeable(prkHex string) (string, string, error) {
// 	_, prk, err := c.parsePrkAuth(prkHex)
// 	if err != nil {
// 		return "", "", err
// 	}
// 	chainID, err := c.GetChainID()
// 	if err != nil {
// 		return "", "", err
// 	}
// 	auth, err := bind.NewKeyedTransactorWithChainID(prk, big.NewInt(int64(chainID)))
// 	if err != nil {
// 		return "", "", err
// 	}
// 	client, err := c.getClient()
// 	if err != nil {
// 		return "", "", err
// 	}
// 	gasPrice, err := c.getGasPrice()
// 	if err != nil {
// 		return "", "", err
// 	}
// 	auth.GasPrice = gasPrice
// 	address, tx, _, err := agentupgradeable.DeployAgentUpgradeable(auth, client)
// 	if err != nil {
// 		return "", "", err
// 	}
// 	return address.Hex(), tx.Hash().Hex(), nil
// }

func (c *Client) AgentUpgradeableCodeVersion(agentAddr string) (int, error) {
	client, err := c.getClient()
	if err != nil {
		return 0, err
	}
	instance, err := agentupgradeable.NewAgentUpgradeable(helpers.HexToAddress(agentAddr), client)
	if err != nil {
		return 0, err
	}
	version, err := instance.GetCurrentVersion(&bind.CallOpts{})
	if err != nil {
		return 0, err
	}
	return int(version), nil
}

func (c *Client) AgentUpgradeableDepsAgents(agentAddr string, version int) ([]string, error) {
	client, err := c.getClient()
	if err != nil {
		return nil, err
	}
	instance, err := agentupgradeable.NewAgentUpgradeable(helpers.HexToAddress(agentAddr), client)
	if err != nil {
		return nil, err
	}
	deps, err := instance.GetDepsAgents(&bind.CallOpts{}, uint16(version))
	if err != nil {
		return nil, err
	}
	depsStr := []string{}
	for _, dep := range deps {
		depsStr = append(depsStr, dep.Hex())
	}
	return depsStr, nil
}
