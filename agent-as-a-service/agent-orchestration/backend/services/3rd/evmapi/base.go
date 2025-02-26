package evmapi

import (
	"math/big"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services/3rd/binds/realworldagentupgradeable"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services/3rd/binds/utilityagentupgradeable"
	"github.com/ethereum/go-ethereum/common"
)

type BaseClient interface {
	WaitMined(hash string) error
	Transact(contractAddr string, prkHex string, input []byte, value *big.Int) (string, error)
	TransactionConfirmed(hash string) error
	InscribeTxs(txHashs []string) (string, error)
	SystemPromptManagerTopup(contractAddr string, prkHex string, agentId int64, amount *big.Int) (string, error)
	SystemPromptManagerMint(contractAddr string, prkHex string, to common.Address, uri string, data []byte, fee *big.Int) (string, error)
	IsContract(address string) (bool, error)
	ConvertAddressForIn(addr string) string
	ConvertAddressForOut(addr string) string
	Erc721Transfer(contractAddr string, prkHex string, toAddr string, tokenId *big.Int) (string, error)
	DeployERC20RealWorldAgent(prkHex string, name string, symbol string, amount *big.Int, recipient common.Address, minFeeToUse *big.Int, timeout uint32, tokenFee common.Address, worker common.Address) (string, string, error)
	DeployERC20UtilityAgent(prkHex string, name string, symbol string, amount *big.Int, recipient common.Address, systemPrompt string, storageInfo []byte) (string, string, error)
	DeployTransparentUpgradeableProxy(prkHex string, logic common.Address, admin common.Address, data []byte) (string, string, error)
}

func UtilityAgentUpgradeableInitializeData(systemPrompt string, storageInfos []utilityagentupgradeable.IUtilityAgentStorageInfo) ([]byte, error) {
	instanceABI, err := utilityagentupgradeable.UtilityAgentUpgradeableMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	dataBytes, err := instanceABI.Pack(
		"initialize",
		systemPrompt,
		storageInfos,
	)
	if err != nil {
		return nil, err
	}
	return dataBytes, nil
}

func RealWorldAgentUpgradeableMetaDataInitializeData(name string, version string, gateway common.Address) ([]byte, error) {
	instanceABI, err := realworldagentupgradeable.RealWorldAgentUpgradeableMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	dataBytes, err := instanceABI.Pack(
		"initialize",
		name,
		version,
		gateway,
	)
	if err != nil {
		return nil, err
	}
	return dataBytes, nil
}
