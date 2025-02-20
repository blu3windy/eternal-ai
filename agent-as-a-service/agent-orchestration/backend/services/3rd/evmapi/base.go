package evmapi

import (
	"math/big"

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
	DeployERC20UtilityAgent(prkHex string, name string, symbol string, amount *big.Int, recipient common.Address, promptScheduler common.Address, modelAddress common.Address, systemPrompt string, storageInfo []byte) (string, string, error)
}
