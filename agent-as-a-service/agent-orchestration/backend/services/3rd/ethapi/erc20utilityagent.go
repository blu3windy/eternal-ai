package ethapi

import (
	"errors"
	"math/big"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/helpers"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services/3rd/binds/erc20utilityagent"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
)

func (c *Client) DeployERC20UtilityAgent(prkHex string, name string, symbol string, amount *big.Int, recipient common.Address, systemPrompt string, storageInfo []byte) (string, string, error) {
	_, prk, err := c.parsePrkAuth(prkHex)
	if err != nil {
		return "", "", err
	}
	chainID, err := c.GetChainID()
	if err != nil {
		return "", "", err
	}
	auth, err := bind.NewKeyedTransactorWithChainID(prk, big.NewInt(int64(chainID)))
	if err != nil {
		return "", "", err
	}
	client, err := c.getClient()
	if err != nil {
		return "", "", err
	}
	gasPrice, err := c.getGasPrice()
	if err != nil {
		return "", "", err
	}
	auth.GasPrice = gasPrice
	address, tx, _, err := erc20utilityagent.DeployERC20UtilityAgent(auth, client, name, symbol, amount, recipient, systemPrompt, storageInfo)
	if err != nil {
		return "", "", err
	}
	return address.Hex(), tx.Hash().Hex(), nil
}

func (c *Client) ERC20UtilityAgentFetchCode(contractAddress string) (string, error) {
	if !common.IsHexAddress(contractAddress) {
		return "", errors.New("erc20Addr is invalid")
	}
	client, err := c.getClient()
	if err != nil {
		return "", err
	}
	instance, err := erc20utilityagent.NewERC20UtilityAgent(helpers.HexToAddress(contractAddress), client)
	if err != nil {
		return "", err
	}
	resp, err := instance.FetchCode(&bind.CallOpts{})
	if err != nil {
		return "", err
	}
	return resp, nil
}

func (c *Client) ERC20UtilityAgentGetStorageInfo(contractAddress string) (*erc20utilityagent.IUtilityAgentStorageInfo, error) {
	if !common.IsHexAddress(contractAddress) {
		return nil, errors.New("erc20Addr is invalid")
	}
	client, err := c.getClient()
	if err != nil {
		return nil, err
	}
	instance, err := erc20utilityagent.NewERC20UtilityAgent(helpers.HexToAddress(contractAddress), client)
	if err != nil {
		return nil, err
	}
	resp, err := instance.GetStorageInfo(&bind.CallOpts{})
	if err != nil {
		return nil, err
	}
	return &resp, nil
}
