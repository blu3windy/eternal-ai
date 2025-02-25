// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package erc20utilityagent

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
	_ = abi.ConvertType
)

// BytecodeSlice is an auto generated low-level Go binding around an user-defined struct.
type BytecodeSlice struct {
	Pointer common.Address
	Start   uint32
	End     uint32
}

// ERC20VotesCheckpoint is an auto generated low-level Go binding around an user-defined struct.
type ERC20VotesCheckpoint struct {
	FromBlock uint32
	Votes     *big.Int
}

// File is an auto generated low-level Go binding around an user-defined struct.
type File struct {
	Size   *big.Int
	Slices []BytecodeSlice
}

// IUtilityAgentStorageInfo is an auto generated low-level Go binding around an user-defined struct.
type IUtilityAgentStorageInfo struct {
	ContractAddress common.Address
	Filename        string
}

// ERC20UtilityAgentMetaData contains all meta data concerning the ERC20UtilityAgent contract.
var ERC20UtilityAgentMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"string\",\"name\":\"name_\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"symbol_\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"amount_\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"recipient_\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"systemPrompt_\",\"type\":\"string\"},{\"internalType\":\"bytes\",\"name\":\"storageInfo_\",\"type\":\"bytes\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[],\"name\":\"DuplicateUuid\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"InvalidData\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"InvalidShortString\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"str\",\"type\":\"string\"}],\"name\":\"StringTooLong\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"ZeroAddress\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"delegator\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"fromDelegate\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"toDelegate\",\"type\":\"address\"}],\"name\":\"DelegateChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"delegate\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"previousBalance\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"newBalance\",\"type\":\"uint256\"}],\"name\":\"DelegateVotesChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[],\"name\":\"EIP712DomainChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"uuid\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"inferId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"caller\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"fowardData\",\"type\":\"bytes\"}],\"name\":\"ForwardPerformed\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"hybridModel\",\"type\":\"address\"}],\"name\":\"ModelUpdate\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"uuid\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"inferId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"caller\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"executionData\",\"type\":\"bytes\"}],\"name\":\"PromptPerformed\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"promptScheduler\",\"type\":\"address\"}],\"name\":\"PromptSchedulerUpdate\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"newSystemPrompt\",\"type\":\"string\"}],\"name\":\"SystemPromptUpdate\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"CLOCK_MODE\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"DOMAIN_SEPARATOR\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"}],\"name\":\"allowance\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint32\",\"name\":\"pos\",\"type\":\"uint32\"}],\"name\":\"checkpoints\",\"outputs\":[{\"components\":[{\"internalType\":\"uint32\",\"name\":\"fromBlock\",\"type\":\"uint32\"},{\"internalType\":\"uint224\",\"name\":\"votes\",\"type\":\"uint224\"}],\"internalType\":\"structERC20Votes.Checkpoint\",\"name\":\"\",\"type\":\"tuple\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"clock\",\"outputs\":[{\"internalType\":\"uint48\",\"name\":\"\",\"type\":\"uint48\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"decimals\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"subtractedValue\",\"type\":\"uint256\"}],\"name\":\"decreaseAllowance\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"delegatee\",\"type\":\"address\"}],\"name\":\"delegate\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"delegatee\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"nonce\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"expiry\",\"type\":\"uint256\"},{\"internalType\":\"uint8\",\"name\":\"v\",\"type\":\"uint8\"},{\"internalType\":\"bytes32\",\"name\":\"r\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"s\",\"type\":\"bytes32\"}],\"name\":\"delegateBySig\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"delegates\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"eip712Domain\",\"outputs\":[{\"internalType\":\"bytes1\",\"name\":\"fields\",\"type\":\"bytes1\"},{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"version\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"chainId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"verifyingContract\",\"type\":\"address\"},{\"internalType\":\"bytes32\",\"name\":\"salt\",\"type\":\"bytes32\"},{\"internalType\":\"uint256[]\",\"name\":\"extensions\",\"type\":\"uint256[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"fetchCode\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"logic\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"uuid\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"dstAgent\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"request\",\"type\":\"bytes\"}],\"name\":\"forward\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"dstActionId\",\"type\":\"uint256\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getFileStorageChunkInfo\",\"outputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"size\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"pointer\",\"type\":\"address\"},{\"internalType\":\"uint32\",\"name\":\"start\",\"type\":\"uint32\"},{\"internalType\":\"uint32\",\"name\":\"end\",\"type\":\"uint32\"}],\"internalType\":\"structBytecodeSlice[]\",\"name\":\"slices\",\"type\":\"tuple[]\"}],\"internalType\":\"structFile\",\"name\":\"file\",\"type\":\"tuple\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"timepoint\",\"type\":\"uint256\"}],\"name\":\"getPastTotalSupply\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"timepoint\",\"type\":\"uint256\"}],\"name\":\"getPastVotes\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"getResultById\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"\",\"type\":\"bytes\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"uuid\",\"type\":\"bytes32\"}],\"name\":\"getResultById\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"\",\"type\":\"bytes\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getStorageInfo\",\"outputs\":[{\"components\":[{\"internalType\":\"address\",\"name\":\"contractAddress\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"filename\",\"type\":\"string\"}],\"internalType\":\"structIUtilityAgent.StorageInfo\",\"name\":\"\",\"type\":\"tuple\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getStorageMode\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getSystemPrompt\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"getVotes\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"addedValue\",\"type\":\"uint256\"}],\"name\":\"increaseAllowance\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"nonces\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"numCheckpoints\",\"outputs\":[{\"internalType\":\"uint32\",\"name\":\"\",\"type\":\"uint32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"deadline\",\"type\":\"uint256\"},{\"internalType\":\"uint8\",\"name\":\"v\",\"type\":\"uint8\"},{\"internalType\":\"bytes32\",\"name\":\"r\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"s\",\"type\":\"bytes32\"}],\"name\":\"permit\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes\",\"name\":\"request\",\"type\":\"bytes\"}],\"name\":\"prompt\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"uuid\",\"type\":\"bytes32\"},{\"internalType\":\"bytes\",\"name\":\"request\",\"type\":\"bytes\"}],\"name\":\"prompt\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalSupply\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"filename\",\"type\":\"string\"}],\"name\":\"updateFileName\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"systemPrompt\",\"type\":\"string\"}],\"name\":\"updateSystemPrompt\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
	Bin: "0x610180604052346200008257620000266200001962000193565b949390939291926200024a565b6040516141509081620015348239608051816130f5015260a051816131b0015260c051816130c6015260e051816131440152610100518161316a01526101205181611347015261014051816113710152610160518161068a0152f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b604081019081106001600160401b03821117620000b957604052565b62000087565b601f909101601f19168101906001600160401b03821190821017620000b957604052565b60405190620000f2826200009d565b565b60005b838110620001085750506000910152565b8181015183820152602001620000f7565b81601f82011215620000825780516001600160401b038111620000b9576040519262000150601f8301601f191660200185620000bf565b818452602082840101116200008257620001719160208085019101620000f4565b90565b6001600160a01b038116036200008257565b5190620000f28262000174565b620056a48038038060405192620001ab8285620000bf565b8339810160c082820312620000825781516001600160401b0390818111620000825782620001db91850162000119565b6020840151828111620000825783620001f691860162000119565b946040850151946200020b6060820162000186565b9460808201518581116200008257816200022791840162000119565b9460a0830151908111620000825762000241920162000119565b91959493929190565b9594909193956040516200025e816200009d565b6001808252603160f81b6020808401918252845190969194926001600160401b038211620000b9576200029e826200029860035462000411565b6200044e565b8790601f831160011462000371575092620002f26200034c979693620002e984620000f29e9f979562000346999660009162000365575b508160011b916000199060031b1c19161790565b60035562000670565b620002fd8162000a50565b610120526200030c8262000b5d565b6101405287815191012060e052519020610100524660a0526200032e62000c6a565b6080523060c052620003403362000a07565b6200076b565b6200087b565b6200035662000859565b80519101206101605262000d3c565b905085015138620002d5565b600360005290601f1983167fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b926000905b828210620003f957505093600184620000f29e9f9794620002f294620003469a976200034c9d9c9910620003df575b5050811b0160035562000670565b86015160001960f88460031b161c191690553880620003d1565b87840151855593840193928b0192908b0190620003a2565b90600182811c9216801562000443575b60208310146200042d57565b634e487b7160e01b600052602260045260246000fd5b91607f169162000421565b601f81116200045b575050565b60009060036000526020600020906020601f850160051c830194106200049e575b601f0160051c01915b8281106200049257505050565b81815560010162000485565b90925082906200047c565b601f8111620004b6575050565b60009060046000526020600020906020601f850160051c83019410620004f9575b601f0160051c01915b828110620004ed57505050565b818155600101620004e0565b9092508290620004d7565b601f811162000511575050565b600090600d6000526020600020906020601f850160051c8301941062000554575b601f0160051c01915b8281106200054857505050565b8181556001016200053b565b909250829062000532565b601f81116200056c575050565b600090600f6000526020600020906020601f850160051c83019410620005af575b601f0160051c01915b828110620005a357505050565b81815560010162000596565b90925082906200058d565b601f8111620005c7575050565b60009060056000526020600020906020601f850160051c830194106200060a575b601f0160051c01915b828110620005fe57505050565b818155600101620005f1565b9092508290620005e8565b601f811162000622575050565b60009060066000526020600020906020601f850160051c8301941062000665575b601f0160051c01915b8281106200065957505050565b8181556001016200064c565b909250829062000643565b80519091906001600160401b038111620000b9576200069c816200069660045462000411565b620004a9565b602080601f8311600114620006e357508190620006d29394600092620006d7575b50508160011b916000199060031b1c19161790565b600455565b015190503880620006bd565b6004600052601f198316949091907f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b926000905b8782106200075257505083600195961062000738575b505050811b01600455565b015160001960f88460031b161c191690553880806200072d565b8060018596829496860151815501950193019062000717565b80519091906001600160401b038111620000b957620007978162000791600d5462000411565b62000504565b602080601f8311600114620007d157508190620007cc9394600092620006d75750508160011b916000199060031b1c19161790565b600d55565b600d600052601f198316949091907fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb5926000905b8782106200084057505083600195961062000826575b505050811b01600d55565b015160001960f88460031b161c191690553880806200081b565b8060018596829496860151815501950193019062000805565b6040519062000868826200009d565b60048252636970667360e01b6020830152565b906014825110620009f5578151820191602060408285031262000082578082015193620008a88562000174565b60408301516001600160401b0393848211620000825783620008d4928162000913950192010162000119565b9460018060a01b03168583604051620008ed816200009d565b8381520152600e80546001600160a01b0319166001600160a01b03909216919091179055565b8351918211620000b95762000935826200092f600f5462000411565b6200055f565b80601f83116001146200096d57508190620009689394600092620006d75750508160011b916000199060031b1c19161790565b600f55565b600f600052601f198316949091907f8d1108e10bcb7c27dddfc02ed9d693a074039d026cf4ea4240b40f7d581ac802926000905b878210620009dc575050836001959610620009c2575b505050811b01600f55565b015160001960f88460031b161c19169055388080620009b7565b80600185968294968601518155019501930190620009a1565b604051635cb045db60e01b8152600490fd5b600c80546001600160a01b039283166001600160a01b0319821681179092559091167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3565b908151602080821060001462000a6e57505090620001719062000e2b565b6001600160401b038211620000b95762000a958262000a8f60055462000411565b620005ba565b602090601f831160011462000ad25750819062000aca9394600092620006d75750508160011b916000199060031b1c19161790565b60055560ff90565b6005600052601f198316949091907f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0926000905b87821062000b4457505083600195961062000b2a575b505050811b0160055560ff90565b015160001960f88460031b161c1916905538808062000b1c565b8060018596829496860151815501950193019062000b06565b908151602080821060001462000b7b57505090620001719062000e2b565b6001600160401b038211620000b95762000ba28262000b9c60065462000411565b62000615565b602090601f831160011462000bdf5750819062000bd79394600092620006d75750508160011b916000199060031b1c19161790565b60065560ff90565b6006600052601f198316949091907ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f926000905b87821062000c5157505083600195961062000c37575b505050811b0160065560ff90565b015160001960f88460031b161c1916905538808062000c29565b8060018596829496860151815501950193019062000c13565b60e051610100516040519060208201927f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8452604083015260608201524660808201523060a082015260a0815260c0810181811060018060401b03821117620000b95760405251902090565b1562000cde57565b60405162461bcd60e51b815260206004820152603060248201527f4552433230566f7465733a20746f74616c20737570706c79207269736b73206f60448201526f766572666c6f77696e6720766f74657360801b6064820152608490fd5b906001600160a01b038216801562000de65760025482810180911162000de05762000ddc9362000dbe9262000d718593600255565b6001600160a01b038216600090815260208181526040808320805487019055518581527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9190a3620013a1565b60025462000dd6906001600160e01b03101562000cd6565b62000fba565b5050565b62000e9a565b60405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606490fd5b601f81511162000e5957602081519101516020821062000e49571790565b6000198260200360031b1b161790565b6044604051809263305a27a960e01b82526020600483015262000e8c8151809281602486015260208686019101620000f4565b601f01601f19168101030190fd5b634e487b7160e01b600052601160045260246000fd5b604080519192919081016001600160401b03811182821017620000b957604052602081935463ffffffff81168352811c910152565b600b549068010000000000000000821015620000b9576001820180600b5582101562000f5357600b600052805160209182015190911b63ffffffff191663ffffffff91909116177f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db990910155565b634e487b7160e01b600052603260045260246000fd5b90815468010000000000000000811015620000b9576001810180845581101562000f5357600092835260209283902082519284015190931b63ffffffff191663ffffffff9290921691909117910155565b600b5490918115918215620011025762000fd3620000e3565b60008152600060208201525b60208101516200100c9062001004906001600160e01b03165b6001600160e01b031690565b958662001517565b93159081620010db575b50156200107357620000f2906200105c620010318562001337565b600b600052917f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db80190565b9063ffffffff82549181199060201b169116179055565b50620000f26200109c620010966200108b43620014af565b65ffffffffffff1690565b620012d1565b620010d5620010ab8562001337565b620010c5620010b9620000e3565b63ffffffff9094168452565b6001600160e01b03166020830152565b62000ee5565b5163ffffffff16905063ffffffff620010f86200108b43620014af565b9116143862001016565b600b6000526200113a7f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db8820162000eb0565b62000eb0565b62000fdf565b90918154918215928360001462001244576200115b620000e3565b60008152600060208201525b60208101516200118d9062001185906001600160e01b031662000ff8565b968762001525565b941590816200121d575b5015620011c4576200105c620000f292620011b28662001337565b92600019019060005260206000200190565b50620000f290620011dd620010966200108b43620014af565b9062001217620011ed8662001337565b62001207620011fb620000e3565b63ffffffff9095168552565b6001600160e01b03166020840152565b62000f69565b5163ffffffff16905063ffffffff6200123a6200108b43620014af565b9116143862001197565b6200125e6200113460001983018460005260206000200190565b62001167565b909181549182159283600014620012b1576200127f620000e3565b60008152600060208201525b60208101516200118d90620012a9906001600160e01b031662000ff8565b968762001517565b620012cb6200113460001983018460005260206000200190565b6200128b565b63ffffffff90818111620012e3571690565b60405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203360448201526532206269747360d01b6064820152608490fd5b6001600160e01b03908181116200134c571690565b60405162461bcd60e51b815260206004820152602760248201527f53616665436173743a2076616c756520646f65736e27742066697420696e20326044820152663234206269747360c81b6064820152608490fd5b60096020527fec8156718a8372b1db44bb411437d0870f3e3790d4a08526d024ce1b0b668f6b546001600160a01b039182166000908152604081205483169392909116908184141580620014a5575b620013fc575b50505050565b82908262001464575b5050508162001417575b8080620013f6565b6001600160a01b0382166000908152600a6020526040902060008051602062005684833981519152916200144b9162001264565b60408051928352602083019190915290a238806200140f565b6000805160206200568483398151915291604082856200148b9452600a6020522062001140565b60408051928352602083019190915290a238818162001405565b50821515620013f0565b65ffffffffffff90818111620014c3571690565b60405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203460448201526538206269747360d01b6064820152608490fd5b90810180911162000de05790565b90810390811162000de0579056fe6080604052600436101561001257600080fd5b60003560e01c806306fdde031461029257806307679a641461028d57806308112bdf1461026a578063095ea7b31461028857806318160ddd146102835780631d959e5d1461027e57806323b872dd14610279578063313ce567146102745780633644e5151461026f578063365bec7f1461026a57806339509351146102655780633a46b1a814610260578063481622f91461025b5780634bf5d7e914610256578063587cde1e146102515780635c19a95c1461024c5780636fcfff451461024757806370a0823114610242578063715018a61461023d57806376a3002914610238578063793042c9146102335780637ecebe001461022e57806384b0196e146102295780638da5cb5b146102245780638e539e8c1461021f57806391ddadf41461021a57806395d89b41146102155780639ab24eb014610210578063a457c2d71461020b578063a9059cbb14610206578063b213c50814610201578063be16d94a146101fc578063c3cda520146101f7578063d505accf146101f2578063dd62ed3e146101ed578063e702c420146101e8578063f1127ed8146101e3578063f2fde38b146101de578063f514b5b8146101d95763f73eb6f3146101d457600080fd5b612440565b6121a2565b612069565b611fa2565b611ef0565b611e53565b611ca8565b611b05565b611a7b565b6119ac565b6118da565b6117cb565b61171c565b611656565b61160c565b611495565b611443565b61130e565b6112a5565b61124f565b611081565b610e2f565b610dc6565b610d4f565b610d09565b610c9e565b610bb5565b610b67565b6109b6565b610928565b610501565b6108e7565b6108ad565b61075b565b610649565b61060d565b6105ba565b61043b565b610311565b60005b8381106102aa5750506000910152565b818101518382015260200161029a565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f6020936102f681518092818752878088019101610297565b0116010190565b90602061030e9281815201906102ba565b90565b34610436576000807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261043357604051908060035490610353826125e7565b808552916020916001918281169081156103e85750600114610390575b61038c8661038081880382610f72565b604051918291826102fd565b0390f35b9350600384527fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b5b8385106103d5575050505081016020016103808261038c38610370565b80548686018401529382019381016103b8565b87965061038c979450602093506103809592507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0091501682840152151560051b820101929338610370565b80fd5b600080fd5b34610436576000807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610433576040519080600d549061047d826125e7565b808552916020916001918281169081156103e857506001146104a95761038c8661038081880382610f72565b9350600d84527fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb55b8385106104ee575050505081016020016103808261038c38610370565b80548686018401529382019381016104d1565b34610436576020807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261043657604051908082528181606051808284015260005b818110610584575060008382018301830152601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016820101030190f35b60808101518682018401840152859350849201610545565b73ffffffffffffffffffffffffffffffffffffffff81160361043657565b346104365760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610436576106026004356105f88161059c565b6024359033612b90565b602060405160018152f35b346104365760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610436576020600254604051908152f35b34610436576000807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610433576106816128a9565b602081519101207f0000000000000000000000000000000000000000000000000000000000000000146000146106bd575061038c61038061270d565b600e5473ffffffffffffffffffffffffffffffffffffffff16908060405180937fe0876aa8000000000000000000000000000000000000000000000000000000008252818061070e60048201612829565b03915afa80156107565761038c928261072e9392610733575b5050612d4f565b610380565b61074f92503d8091833e6107478183610f72565b81019061273d565b3880610727565b612838565b346104365760607ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610436576004356107968161059c565b6024356107a28161059c565b6044359073ffffffffffffffffffffffffffffffffffffffff831660005260016020526107f33360406000209073ffffffffffffffffffffffffffffffffffffffff16600052602052604060002090565b54927fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8403610833575b6108279350612f33565b60405160018152602090f35b82841061084f5761084a8361082795033383612b90565b61081d565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152fd5b346104365760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261043657602060405160128152f35b346104365760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126104365760206109206130af565b604051908152f35b346104365760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610436576004356109638161059c565b33600052600160205261099a8160406000209073ffffffffffffffffffffffffffffffffffffffff16600052602052604060002090565b5460243581018091116109b1576106029133612b90565b61259d565b346104365760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610436576004356109f18161059c565b73ffffffffffffffffffffffffffffffffffffffff60243591610a2565ffffffffffff610a1d43613593565b168410612844565b16600052600a602052604060002080549160008360058111610b16575b50905b838210610ac557505081610a80575050602060005b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff60405191168152f35b610ab9610ac0917fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff602094019060005260206000200190565b5460201c90565b610a5a565b9092610ad18185613924565b908263ffffffff610af6610aec858860005260206000200190565b5463ffffffff1690565b161115610b065750925b90610a45565b9350610b11906125cc565b610b00565b80610b26610b2c929693966137e4565b906125da565b908263ffffffff610b47610aec858860005260206000200190565b161115610b575750925b38610a42565b9350610b62906125cc565b610b51565b346104365760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126104365761038c610ba16128a9565b6040519182916020835260208301906102ba565b346104365760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610436574365ffffffffffff610bf543613593565b1603610c405761038c604051610c0a81610efd565b601d81527f6d6f64653d626c6f636b6e756d6265722666726f6d3d64656661756c740000006020820152604051918291826102fd565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f4552433230566f7465733a2062726f6b656e20636c6f636b206d6f64650000006044820152fd5b346104365760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610436576020600435610cdb8161059c565b73ffffffffffffffffffffffffffffffffffffffff8091166000526009825260406000205416604051908152f35b346104365760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261043657610d4d600435610d478161059c565b336131d6565b005b346104365760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126104365773ffffffffffffffffffffffffffffffffffffffff600435610d9f8161059c565b16600052600a6020526020610db8604060002054613287565b63ffffffff60405191168152f35b346104365760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126104365773ffffffffffffffffffffffffffffffffffffffff600435610e168161059c565b1660005260006020526020604060002054604051908152f35b34610436576000807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261043357610e6761331c565b8073ffffffffffffffffffffffffffffffffffffffff600c547fffffffffffffffffffffffff00000000000000000000000000000000000000008116600c55167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040810190811067ffffffffffffffff821117610f1957604052565b610ece565b6060810190811067ffffffffffffffff821117610f1957604052565b6020810190811067ffffffffffffffff821117610f1957604052565b60c0810190811067ffffffffffffffff821117610f1957604052565b90601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0910116810190811067ffffffffffffffff821117610f1957604052565b60405190610fc082610efd565b565b92919267ffffffffffffffff8211610f19576040519161100a60207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8401160184610f72565b829481845281830111610436578281602093846000960137010152565b60207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc820112610436576004359067ffffffffffffffff821161043657806023830112156104365781602461030e93600401359101610fc2565b346104365761108f36611027565b61109761331c565b805167ffffffffffffffff8111610f19576110bc816110b7600d546125e7565b612939565b602080601f831160011461114e57509161112f8261113e937fdf5a31f32f865da404304d8e717e689823eab72d259d756d85fc552ef9ac78d895600091611143575b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8260011b9260031b1c19161790565b600d55604051918291826102fd565b0390a1005b9050830151386110fe565b600d600052907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe083167fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb5926000905b82821061121c575050927fdf5a31f32f865da404304d8e717e689823eab72d259d756d85fc552ef9ac78d894926001928261113e96106111e5575b5050811b01600d55610380565b8401517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60f88460031b161c1916905538806111d8565b80600185968294968a0151815501950193019061119d565b9080601f830112156104365781602061030e93359101610fc2565b60207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126104365760043567ffffffffffffffff811161043657611299903690600401611234565b50602060405160008152f35b346104365760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126104365773ffffffffffffffffffffffffffffffffffffffff6004356112f58161059c565b1660005260076020526020604060002054604051908152f35b34610436576000807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610433576113e69061136b7f000000000000000000000000000000000000000000000000000000000000000061339b565b906113957f00000000000000000000000000000000000000000000000000000000000000006134d3565b90604051916113a383610f3a565b8183526113f46020916040519687967f0f00000000000000000000000000000000000000000000000000000000000000885260e0602089015260e08801906102ba565b9086820360408801526102ba565b904660608601523060808601528260a086015284820360c0860152602080855193848152019401925b82811061142c57505050500390f35b83518552869550938101939281019260010161141d565b346104365760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261043657602073ffffffffffffffffffffffffffffffffffffffff600c5416604051908152f35b346104365760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610436576004356114e265ffffffffffff6114da43613593565b168210612844565b600b5490600082600581116115a5575b50905b82821061154257828061150f575060405160008152602090f35b600b600052602090610ac0907f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db801610ab9565b909161154e8184613924565b600b600052908263ffffffff6115857f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db98501610aec565b1611156115955750915b906114f5565b92506115a0906125cc565b61158f565b80610b266115b5929593956137e4565b600b600052908263ffffffff6115ec7f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db98501610aec565b1611156115fc5750915b386114f2565b9250611607906125cc565b6115f6565b346104365760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261043657602061164643613593565b65ffffffffffff60405191168152f35b34610436576000807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261043357604051908060045490611698826125e7565b808552916020916001918281169081156103e857506001146116c45761038c8661038081880382610f72565b9350600484527f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b5b838510611709575050505081016020016103808261038c38610370565b80548686018401529382019381016116ec565b346104365760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126104365773ffffffffffffffffffffffffffffffffffffffff60043561176c8161059c565b16600052600a60205260406000208054801560001461179357505060405160008152602090f35b6020917fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6117c2920190612a1d565b5054811c610a5a565b346104365760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610436576004356118068161059c565b602435903360005260016020526118418160406000209073ffffffffffffffffffffffffffffffffffffffff16600052602052604060002090565b54918083106118565761082792039033612b90565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f0000000000000000000000000000000000000000000000000000006064820152fd5b346104365760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610436576106026004356119188161059c565b6024359033612f33565b906020908183526060918060608501928051828701520151938160806040926040808201528751809652019501936000915b8483106119645750505050505090565b8551805173ffffffffffffffffffffffffffffffffffffffff1688528085015163ffffffff908116898701529082015116878201529581019594830194600190920191611954565b34610436576000807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610433576119e4612a64565b5073ffffffffffffffffffffffffffffffffffffffff600e54168160405180927fe0876aa8000000000000000000000000000000000000000000000000000000008252602060048301528180611a3c6024820161263a565b03915afa908115610756578261038c9392611a60575b505060405191829182611922565b611a7492503d8091833e6107478183610f72565b3880611a52565b60407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126104365760243567ffffffffffffffff8082116104365736602383011215610436578160040135908111610436573691016024011161043657602060405160008152f35b6064359060ff8216820361043657565b6084359060ff8216820361043657565b346104365760c07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261043657600435611b408161059c565b60443590602435611b4f611ae5565b92804211611c4a57611c0b611c4591610d4d9560405190611bf382611bc76020820195898b8860609194939273ffffffffffffffffffffffffffffffffffffffff60808301967fe48329057bfd03d55e49b547132e39cffd9c1820ad7b9d4c5307691425d15adf845216602083015260408201520152565b037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08101845283610f72565b611c0660a435936084359351902061362a565b61366b565b91611c3f8373ffffffffffffffffffffffffffffffffffffffff166000526007602052604060002090815491600183019055565b14612a7e565b6131d6565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f4552433230566f7465733a207369676e617475726520657870697265640000006044820152fd5b346104365760e07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261043657600435611ce38161059c565b602435611cef8161059c565b6044359060643592611cff611af5565b93804211611df557611dd0611df091611bc7610d4d97611dbd611d4b8773ffffffffffffffffffffffffffffffffffffffff166000526007602052604060002090815491600183019055565b9360405193849160208301968c8c8c8a91959493909260a09360c08401977f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9855273ffffffffffffffffffffffffffffffffffffffff8092166020860152166040840152606083015260808201520152565b611c0660c4359360a4359351902061362a565b73ffffffffffffffffffffffffffffffffffffffff808416911614612ae3565b612b90565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f45524332305065726d69743a206578706972656420646561646c696e650000006044820152fd5b346104365760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610436576020611ee7600435611e938161059c565b73ffffffffffffffffffffffffffffffffffffffff60243591611eb58361059c565b166000526001835260406000209073ffffffffffffffffffffffffffffffffffffffff16600052602052604060002090565b54604051908152f35b346104365760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261043657611f27612a64565b50604051611f3481610efd565b73ffffffffffffffffffffffffffffffffffffffff9081600e5416815261038c604051611f6b81611f648161263a565b0382610f72565b6020830190815260405193849360208552511660208401525160408084015260608301906102ba565b63ffffffff81160361043657565b346104365760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261043657604061203361202d600435611fe58161059c565b73ffffffffffffffffffffffffffffffffffffffff6024359161200783611f94565b60006020875161201681610efd565b828152015216600052600a60205283600020612a1d565b50612b48565b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff602083519263ffffffff81511684520151166020820152f35b346104365760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610436576004356120a48161059c565b6120ac61331c565b73ffffffffffffffffffffffffffffffffffffffff80911690811561211e57600c54827fffffffffffffffffffffffff0000000000000000000000000000000000000000821617600c55167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3005b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152fd5b60607ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610436576004356024356121db8161059c565b67ffffffffffffffff90604435828111610436576121fd903690600401611234565b9273ffffffffffffffffffffffffffffffffffffffff938461224661222c846000526010602052604060002090565b5473ffffffffffffffffffffffffffffffffffffffff1690565b166124165761225490613699565b91602060405180967fbe16d94a00000000000000000000000000000000000000000000000000000000825281600081612291898960048401612b79565b039286165af19384156107565761038c956000956123d9575b508492916122ef612396926122dc6122c0610fb3565b73ffffffffffffffffffffffffffffffffffffffff9094168452565b851667ffffffffffffffff166020830152565b612303836000526010602052604060002090565b815181547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff9190911617815590602001517fffffffff0000000000000000ffffffffffffffffffffffffffffffffffffffff7bffffffffffffffff000000000000000000000000000000000000000083549260a01b169116179055565b7f103ab115fdd2f05d2720873cd21aeff07c1206de37259cdeb99463da9ff512e0604051806123c63396826102fd565b0390a46040519081529081906020820190565b6122ef95509161240561239692949360203d60201161240f575b6123fd8183610f72565b810190612b6a565b95509192906122aa565b503d6123f3565b60046040517f339f7ff5000000000000000000000000000000000000000000000000000000008152fd5b346104365761244e36611027565b61245661331c565b805167ffffffffffffffff8111610f195761247b81612476600f546125e7565b6129ab565b602080601f83116001146124da575081906124ca936000926124cf575b50507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8260011b9260031b1c19161790565b600f55005b015190503880612498565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe083169361252b600f6000527f8d1108e10bcb7c27dddfc02ed9d693a074039d026cf4ea4240b40f7d581ac80290565b926000905b868210612585575050836001951061254e575b505050811b01600f55005b01517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60f88460031b161c19169055388080612543565b80600185968294968601518155019501930190612530565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b90600182018092116109b157565b919082039182116109b157565b90600182811c92168015612630575b602083101461260157565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b91607f16916125f6565b600f546000929161264a826125e7565b808252916020906001908181169081156126c9575060011461266d575b50505050565b92939450600f6000527f8d1108e10bcb7c27dddfc02ed9d693a074039d026cf4ea4240b40f7d581ac802926000935b8585106126b6575050506020925001019038808080612667565b805485850184015293820193810161269c565b91505060209495507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0091509291921683830152151560051b01019038808080612667565b60405190610fc08261271e8161263a565b0383610f72565b67ffffffffffffffff8111610f195760051b60200190565b6020808284031261043657815167ffffffffffffffff9283821161043657019260409283858303126104365783519461277586610efd565b8051865283810151918211610436570181601f820112156104365780519161279c83612725565b946127a981519687610f72565b8386528486019185606080960285010193818511610436578601925b8484106127d85750505050505082015290565b85848303126104365786869184516127ef81610f1e565b86516127fa8161059c565b81528287015161280981611f94565b838201528587015161281a81611f94565b868201528152019301926127c5565b602061030e918181520161263a565b6040513d6000823e3d90fd5b1561284b57565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601960248201527f4552433230566f7465733a20667574757265206c6f6f6b7570000000000000006044820152fd5b600e5473ffffffffffffffffffffffffffffffffffffffff1615612900576040516128d381610efd565b600281527f6673000000000000000000000000000000000000000000000000000000000000602082015290565b60405161290c81610efd565b600481527f6970667300000000000000000000000000000000000000000000000000000000602082015290565b601f8111612945575050565b600090600d6000527fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb5906020601f850160051c830194106129a1575b601f0160051c01915b82811061299657505050565b81815560010161298a565b9092508290612981565b601f81116129b7575050565b600090600f6000527f8d1108e10bcb7c27dddfc02ed9d693a074039d026cf4ea4240b40f7d581ac802906020601f850160051c83019410612a13575b601f0160051c01915b828110612a0857505050565b8181556001016129fc565b90925082906129f3565b8054821015612a355760005260206000200190600090565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60405190612a7182610efd565b6060602083600081520152565b15612a8557565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601960248201527f4552433230566f7465733a20696e76616c6964206e6f6e6365000000000000006044820152fd5b15612aea57565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f45524332305065726d69743a20696e76616c6964207369676e617475726500006044820152fd5b90604051612b5581610efd565b602081935463ffffffff81168352811c910152565b90816020910312610436575190565b60409061030e9392815281602082015201906102ba565b9073ffffffffffffffffffffffffffffffffffffffff91828116928315612ccc578216938415612c485780612c327f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92594612c0d612c439573ffffffffffffffffffffffffffffffffffffffff166000526001602052604060002090565b9073ffffffffffffffffffffffffffffffffffffffff16600052602052604060002090565b556040519081529081906020820190565b0390a3565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f73730000000000000000000000000000000000000000000000000000000000006064820152fd5b60846040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f72657373000000000000000000000000000000000000000000000000000000006064820152fd5b906020809201518051906020916040805195600080945b848610612da557505050505050601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe091828101855201168201604052565b909192939495838760051b8301015180518686830151920151813b808211612de6575082849392600195938e930394859301903c0196019493929190612d66565b9260849387937f86d14d89000000000000000000000000000000000000000000000000000000008552600452602452604452606452fd5b15612e2457565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f65737300000000000000000000000000000000000000000000000000000000006064820152fd5b15612eaf57565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e636500000000000000000000000000000000000000000000000000006064820152fd5b919073ffffffffffffffffffffffffffffffffffffffff92838116801561302b57610fc094831690612f66821515612e1d565b84612f918473ffffffffffffffffffffffffffffffffffffffff166000526000602052604060002090565b54612f9e82821015612ea8565b03612fc98473ffffffffffffffffffffffffffffffffffffffff166000526000602052604060002090565b55612ff48473ffffffffffffffffffffffffffffffffffffffff166000526000602052604060002090565b8054860190556040518581527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90602090a3613e61565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f64726573730000000000000000000000000000000000000000000000000000006064820152fd5b73ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000163014806131ad575b15613117577f000000000000000000000000000000000000000000000000000000000000000090565b60405160208101907f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f82527f000000000000000000000000000000000000000000000000000000000000000060408201527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a082015260a081526131a781610f56565b51902090565b507f000000000000000000000000000000000000000000000000000000000000000046146130ee565b610fc09173ffffffffffffffffffffffffffffffffffffffff80921660008181526009602052836040822054168092826020527f3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f604084205496600960205261327d87604087209073ffffffffffffffffffffffffffffffffffffffff167fffffffffffffffffffffffff0000000000000000000000000000000000000000825416179055565b86169380a4613939565b63ffffffff90818111613298571690565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203360448201527f32206269747300000000000000000000000000000000000000000000000000006064820152fd5b73ffffffffffffffffffffffffffffffffffffffff600c5416330361333d57565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b60ff81146133f15760ff811690601f82116133c757604051916133bd83610efd565b8252602082015290565b60046040517fb3512b0c000000000000000000000000000000000000000000000000000000008152fd5b50604051600554816000613404836125e7565b80835292602090600190818116908115613490575060011461342f575b505061030e92500382610f72565b91509260056000527f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0936000925b828410613478575061030e9450505081016020013880613421565b8554878501830152948501948694509281019261345d565b90506020935061030e9592507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0091501682840152151560051b8201013880613421565b60ff81146134f55760ff811690601f82116133c757604051916133bd83610efd565b50604051600654816000613508836125e7565b80835292602090600190818116908115613490575060011461353257505061030e92500382610f72565b91509260066000527ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f936000925b82841061357b575061030e9450505081016020013880613421565b85548785018301529485019486945092810192613560565b65ffffffffffff908181116135a6571690565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203460448201527f38206269747300000000000000000000000000000000000000000000000000006064820152fd5b6042906136356130af565b90604051917f19010000000000000000000000000000000000000000000000000000000000008352600283015260228201522090565b9161030e939161367a93613c10565b919091613cd8565b9061369560209282815194859201610297565b0190565b60405190816020600090600d54906136b0826125e7565b916001908181169081156137645750600114613703575b5050506136d79061030e93613682565b037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08101835282610f72565b90919250600d6000527fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb5906000915b84831061374e57505050508101602001826136d761030e6136c7565b8054888401850152879550918301918101613732565b6136d795506020935061030e979492507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0091501682860152801515028401019181946136c7565b81156137b5570490565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b801561391e57806138b76138b06138a661389c61389261388861387e613874600161030e9a6000908b60801c80613912575b508060401c80613905575b508060201c806138f8575b508060101c806138eb575b508060081c806138de575b508060041c806138d1575b508060021c806138c4575b50821c6138bd575b811c1b61386d818b6137ab565b0160011c90565b61386d818a6137ab565b61386d81896137ab565b61386d81886137ab565b61386d81876137ab565b61386d81866137ab565b61386d81856137ab565b80926137ab565b90613ea2565b8101613860565b6002915091019038613858565b600491509101903861384d565b6008915091019038613842565b6010915091019038613837565b602091509101903861382c565b6040915091019038613821565b91505060809038613816565b50600090565b90808216911860011c81018091116109b15790565b919073ffffffffffffffffffffffffffffffffffffffff80821693168381141580613c07575b6139695750505050565b806139e9575b508261397c575b80612667565b7fdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724916139cb6139d09273ffffffffffffffffffffffffffffffffffffffff16600052600a602052604060002090565b613f47565b60408051928352602083019190915290a2388080613976565b80600052600a6020527fdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a7246040600020805480159182600014613bc657613a2d610fb3565b6000815260006020820152915b613a87613a6660208501517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1690565b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1690565b92613a928985614100565b94159081613ba3575b5015613b2c57613ae1613b16927fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff613ad287614053565b93019060005260206000200190565b9063ffffffff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000083549260201b169116179055565b604080519182526020820192909252a23861396f565b50613b9e90613b50613b4b613b4043613593565b65ffffffffffff1690565b613287565b90613b99613b5d86614053565b613b74613b68610fb3565b63ffffffff9095168552565b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff166020840152565b613eb4565b613b16565b5163ffffffff16905063ffffffff613bbd613b4043613593565b91161438613a9b565b613c01613bfc7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff84018360005260206000200190565b612b48565b91613a3a565b5082151561395f565b9291907f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311613c935791608094939160ff602094604051948552168484015260408301526060820152600093849182805260015afa1561075657815173ffffffffffffffffffffffffffffffffffffffff811615613c8d579190565b50600190565b50505050600090600390565b60051115613ca957565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b613ce181613c9f565b80613ce95750565b613cf281613c9f565b60018103613d59576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606490fd5b613d6281613c9f565b60028103613dc9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606490fd5b80613dd5600392613c9f565b14613ddc57565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c60448201527f75650000000000000000000000000000000000000000000000000000000000006064820152608490fd5b90610fc0929173ffffffffffffffffffffffffffffffffffffffff809116600052600960205280806040600020541692166000526040600020541690613939565b9080821015613eaf575090565b905090565b805468010000000000000000811015610f1957613ed691600182018155612a1d565b613f1857815160209283015190921b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000001663ffffffff92909216919091179055565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b90918154918215928360001461401857613f5f610fb3565b60008152600060208201525b613fa1613f9a613a6660208401517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1690565b968761410d565b94159081613ff5575b5015613fe157613ae1610fc0927fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff613ad287614053565b50610fc090613b50613b4b613b4043613593565b5163ffffffff16905063ffffffff61400f613b4043613593565b91161438613faa565b61404e613bfc7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff83018460005260206000200190565b613f6b565b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff9081811161407c571690565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602760248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203260448201527f32342062697473000000000000000000000000000000000000000000000000006064820152fd5b9081039081116109b15790565b9081018091116109b1579056fea2646970667358221220a1b72293258911740432ead70acaf62f4438edf3508dc718e0cda2266a0bd55964736f6c63430008160033dec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724",
}

// ERC20UtilityAgentABI is the input ABI used to generate the binding from.
// Deprecated: Use ERC20UtilityAgentMetaData.ABI instead.
var ERC20UtilityAgentABI = ERC20UtilityAgentMetaData.ABI

// ERC20UtilityAgentBin is the compiled bytecode used for deploying new contracts.
// Deprecated: Use ERC20UtilityAgentMetaData.Bin instead.
var ERC20UtilityAgentBin = ERC20UtilityAgentMetaData.Bin

// DeployERC20UtilityAgent deploys a new Ethereum contract, binding an instance of ERC20UtilityAgent to it.
func DeployERC20UtilityAgent(auth *bind.TransactOpts, backend bind.ContractBackend, name_ string, symbol_ string, amount_ *big.Int, recipient_ common.Address, systemPrompt_ string, storageInfo_ []byte) (common.Address, *types.Transaction, *ERC20UtilityAgent, error) {
	parsed, err := ERC20UtilityAgentMetaData.GetAbi()
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	if parsed == nil {
		return common.Address{}, nil, nil, errors.New("GetABI returned nil")
	}

	address, tx, contract, err := bind.DeployContract(auth, *parsed, common.FromHex(ERC20UtilityAgentBin), backend, name_, symbol_, amount_, recipient_, systemPrompt_, storageInfo_)
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	return address, tx, &ERC20UtilityAgent{ERC20UtilityAgentCaller: ERC20UtilityAgentCaller{contract: contract}, ERC20UtilityAgentTransactor: ERC20UtilityAgentTransactor{contract: contract}, ERC20UtilityAgentFilterer: ERC20UtilityAgentFilterer{contract: contract}}, nil
}

// ERC20UtilityAgent is an auto generated Go binding around an Ethereum contract.
type ERC20UtilityAgent struct {
	ERC20UtilityAgentCaller     // Read-only binding to the contract
	ERC20UtilityAgentTransactor // Write-only binding to the contract
	ERC20UtilityAgentFilterer   // Log filterer for contract events
}

// ERC20UtilityAgentCaller is an auto generated read-only Go binding around an Ethereum contract.
type ERC20UtilityAgentCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// ERC20UtilityAgentTransactor is an auto generated write-only Go binding around an Ethereum contract.
type ERC20UtilityAgentTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// ERC20UtilityAgentFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type ERC20UtilityAgentFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// ERC20UtilityAgentSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type ERC20UtilityAgentSession struct {
	Contract     *ERC20UtilityAgent // Generic contract binding to set the session for
	CallOpts     bind.CallOpts      // Call options to use throughout this session
	TransactOpts bind.TransactOpts  // Transaction auth options to use throughout this session
}

// ERC20UtilityAgentCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type ERC20UtilityAgentCallerSession struct {
	Contract *ERC20UtilityAgentCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts            // Call options to use throughout this session
}

// ERC20UtilityAgentTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type ERC20UtilityAgentTransactorSession struct {
	Contract     *ERC20UtilityAgentTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts            // Transaction auth options to use throughout this session
}

// ERC20UtilityAgentRaw is an auto generated low-level Go binding around an Ethereum contract.
type ERC20UtilityAgentRaw struct {
	Contract *ERC20UtilityAgent // Generic contract binding to access the raw methods on
}

// ERC20UtilityAgentCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type ERC20UtilityAgentCallerRaw struct {
	Contract *ERC20UtilityAgentCaller // Generic read-only contract binding to access the raw methods on
}

// ERC20UtilityAgentTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type ERC20UtilityAgentTransactorRaw struct {
	Contract *ERC20UtilityAgentTransactor // Generic write-only contract binding to access the raw methods on
}

// NewERC20UtilityAgent creates a new instance of ERC20UtilityAgent, bound to a specific deployed contract.
func NewERC20UtilityAgent(address common.Address, backend bind.ContractBackend) (*ERC20UtilityAgent, error) {
	contract, err := bindERC20UtilityAgent(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &ERC20UtilityAgent{ERC20UtilityAgentCaller: ERC20UtilityAgentCaller{contract: contract}, ERC20UtilityAgentTransactor: ERC20UtilityAgentTransactor{contract: contract}, ERC20UtilityAgentFilterer: ERC20UtilityAgentFilterer{contract: contract}}, nil
}

// NewERC20UtilityAgentCaller creates a new read-only instance of ERC20UtilityAgent, bound to a specific deployed contract.
func NewERC20UtilityAgentCaller(address common.Address, caller bind.ContractCaller) (*ERC20UtilityAgentCaller, error) {
	contract, err := bindERC20UtilityAgent(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &ERC20UtilityAgentCaller{contract: contract}, nil
}

// NewERC20UtilityAgentTransactor creates a new write-only instance of ERC20UtilityAgent, bound to a specific deployed contract.
func NewERC20UtilityAgentTransactor(address common.Address, transactor bind.ContractTransactor) (*ERC20UtilityAgentTransactor, error) {
	contract, err := bindERC20UtilityAgent(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &ERC20UtilityAgentTransactor{contract: contract}, nil
}

// NewERC20UtilityAgentFilterer creates a new log filterer instance of ERC20UtilityAgent, bound to a specific deployed contract.
func NewERC20UtilityAgentFilterer(address common.Address, filterer bind.ContractFilterer) (*ERC20UtilityAgentFilterer, error) {
	contract, err := bindERC20UtilityAgent(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &ERC20UtilityAgentFilterer{contract: contract}, nil
}

// bindERC20UtilityAgent binds a generic wrapper to an already deployed contract.
func bindERC20UtilityAgent(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := ERC20UtilityAgentMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_ERC20UtilityAgent *ERC20UtilityAgentRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _ERC20UtilityAgent.Contract.ERC20UtilityAgentCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_ERC20UtilityAgent *ERC20UtilityAgentRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.ERC20UtilityAgentTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_ERC20UtilityAgent *ERC20UtilityAgentRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.ERC20UtilityAgentTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _ERC20UtilityAgent.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.contract.Transact(opts, method, params...)
}

// CLOCKMODE is a free data retrieval call binding the contract method 0x4bf5d7e9.
//
// Solidity: function CLOCK_MODE() view returns(string)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) CLOCKMODE(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "CLOCK_MODE")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// CLOCKMODE is a free data retrieval call binding the contract method 0x4bf5d7e9.
//
// Solidity: function CLOCK_MODE() view returns(string)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) CLOCKMODE() (string, error) {
	return _ERC20UtilityAgent.Contract.CLOCKMODE(&_ERC20UtilityAgent.CallOpts)
}

// CLOCKMODE is a free data retrieval call binding the contract method 0x4bf5d7e9.
//
// Solidity: function CLOCK_MODE() view returns(string)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) CLOCKMODE() (string, error) {
	return _ERC20UtilityAgent.Contract.CLOCKMODE(&_ERC20UtilityAgent.CallOpts)
}

// DOMAINSEPARATOR is a free data retrieval call binding the contract method 0x3644e515.
//
// Solidity: function DOMAIN_SEPARATOR() view returns(bytes32)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) DOMAINSEPARATOR(opts *bind.CallOpts) ([32]byte, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "DOMAIN_SEPARATOR")

	if err != nil {
		return *new([32]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)

	return out0, err

}

// DOMAINSEPARATOR is a free data retrieval call binding the contract method 0x3644e515.
//
// Solidity: function DOMAIN_SEPARATOR() view returns(bytes32)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) DOMAINSEPARATOR() ([32]byte, error) {
	return _ERC20UtilityAgent.Contract.DOMAINSEPARATOR(&_ERC20UtilityAgent.CallOpts)
}

// DOMAINSEPARATOR is a free data retrieval call binding the contract method 0x3644e515.
//
// Solidity: function DOMAIN_SEPARATOR() view returns(bytes32)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) DOMAINSEPARATOR() ([32]byte, error) {
	return _ERC20UtilityAgent.Contract.DOMAINSEPARATOR(&_ERC20UtilityAgent.CallOpts)
}

// Allowance is a free data retrieval call binding the contract method 0xdd62ed3e.
//
// Solidity: function allowance(address owner, address spender) view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) Allowance(opts *bind.CallOpts, owner common.Address, spender common.Address) (*big.Int, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "allowance", owner, spender)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// Allowance is a free data retrieval call binding the contract method 0xdd62ed3e.
//
// Solidity: function allowance(address owner, address spender) view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) Allowance(owner common.Address, spender common.Address) (*big.Int, error) {
	return _ERC20UtilityAgent.Contract.Allowance(&_ERC20UtilityAgent.CallOpts, owner, spender)
}

// Allowance is a free data retrieval call binding the contract method 0xdd62ed3e.
//
// Solidity: function allowance(address owner, address spender) view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) Allowance(owner common.Address, spender common.Address) (*big.Int, error) {
	return _ERC20UtilityAgent.Contract.Allowance(&_ERC20UtilityAgent.CallOpts, owner, spender)
}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address account) view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) BalanceOf(opts *bind.CallOpts, account common.Address) (*big.Int, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "balanceOf", account)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address account) view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) BalanceOf(account common.Address) (*big.Int, error) {
	return _ERC20UtilityAgent.Contract.BalanceOf(&_ERC20UtilityAgent.CallOpts, account)
}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address account) view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) BalanceOf(account common.Address) (*big.Int, error) {
	return _ERC20UtilityAgent.Contract.BalanceOf(&_ERC20UtilityAgent.CallOpts, account)
}

// Checkpoints is a free data retrieval call binding the contract method 0xf1127ed8.
//
// Solidity: function checkpoints(address account, uint32 pos) view returns((uint32,uint224))
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) Checkpoints(opts *bind.CallOpts, account common.Address, pos uint32) (ERC20VotesCheckpoint, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "checkpoints", account, pos)

	if err != nil {
		return *new(ERC20VotesCheckpoint), err
	}

	out0 := *abi.ConvertType(out[0], new(ERC20VotesCheckpoint)).(*ERC20VotesCheckpoint)

	return out0, err

}

// Checkpoints is a free data retrieval call binding the contract method 0xf1127ed8.
//
// Solidity: function checkpoints(address account, uint32 pos) view returns((uint32,uint224))
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) Checkpoints(account common.Address, pos uint32) (ERC20VotesCheckpoint, error) {
	return _ERC20UtilityAgent.Contract.Checkpoints(&_ERC20UtilityAgent.CallOpts, account, pos)
}

// Checkpoints is a free data retrieval call binding the contract method 0xf1127ed8.
//
// Solidity: function checkpoints(address account, uint32 pos) view returns((uint32,uint224))
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) Checkpoints(account common.Address, pos uint32) (ERC20VotesCheckpoint, error) {
	return _ERC20UtilityAgent.Contract.Checkpoints(&_ERC20UtilityAgent.CallOpts, account, pos)
}

// Clock is a free data retrieval call binding the contract method 0x91ddadf4.
//
// Solidity: function clock() view returns(uint48)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) Clock(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "clock")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// Clock is a free data retrieval call binding the contract method 0x91ddadf4.
//
// Solidity: function clock() view returns(uint48)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) Clock() (*big.Int, error) {
	return _ERC20UtilityAgent.Contract.Clock(&_ERC20UtilityAgent.CallOpts)
}

// Clock is a free data retrieval call binding the contract method 0x91ddadf4.
//
// Solidity: function clock() view returns(uint48)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) Clock() (*big.Int, error) {
	return _ERC20UtilityAgent.Contract.Clock(&_ERC20UtilityAgent.CallOpts)
}

// Decimals is a free data retrieval call binding the contract method 0x313ce567.
//
// Solidity: function decimals() view returns(uint8)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) Decimals(opts *bind.CallOpts) (uint8, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "decimals")

	if err != nil {
		return *new(uint8), err
	}

	out0 := *abi.ConvertType(out[0], new(uint8)).(*uint8)

	return out0, err

}

// Decimals is a free data retrieval call binding the contract method 0x313ce567.
//
// Solidity: function decimals() view returns(uint8)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) Decimals() (uint8, error) {
	return _ERC20UtilityAgent.Contract.Decimals(&_ERC20UtilityAgent.CallOpts)
}

// Decimals is a free data retrieval call binding the contract method 0x313ce567.
//
// Solidity: function decimals() view returns(uint8)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) Decimals() (uint8, error) {
	return _ERC20UtilityAgent.Contract.Decimals(&_ERC20UtilityAgent.CallOpts)
}

// Delegates is a free data retrieval call binding the contract method 0x587cde1e.
//
// Solidity: function delegates(address account) view returns(address)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) Delegates(opts *bind.CallOpts, account common.Address) (common.Address, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "delegates", account)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Delegates is a free data retrieval call binding the contract method 0x587cde1e.
//
// Solidity: function delegates(address account) view returns(address)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) Delegates(account common.Address) (common.Address, error) {
	return _ERC20UtilityAgent.Contract.Delegates(&_ERC20UtilityAgent.CallOpts, account)
}

// Delegates is a free data retrieval call binding the contract method 0x587cde1e.
//
// Solidity: function delegates(address account) view returns(address)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) Delegates(account common.Address) (common.Address, error) {
	return _ERC20UtilityAgent.Contract.Delegates(&_ERC20UtilityAgent.CallOpts, account)
}

// Eip712Domain is a free data retrieval call binding the contract method 0x84b0196e.
//
// Solidity: function eip712Domain() view returns(bytes1 fields, string name, string version, uint256 chainId, address verifyingContract, bytes32 salt, uint256[] extensions)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) Eip712Domain(opts *bind.CallOpts) (struct {
	Fields            [1]byte
	Name              string
	Version           string
	ChainId           *big.Int
	VerifyingContract common.Address
	Salt              [32]byte
	Extensions        []*big.Int
}, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "eip712Domain")

	outstruct := new(struct {
		Fields            [1]byte
		Name              string
		Version           string
		ChainId           *big.Int
		VerifyingContract common.Address
		Salt              [32]byte
		Extensions        []*big.Int
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.Fields = *abi.ConvertType(out[0], new([1]byte)).(*[1]byte)
	outstruct.Name = *abi.ConvertType(out[1], new(string)).(*string)
	outstruct.Version = *abi.ConvertType(out[2], new(string)).(*string)
	outstruct.ChainId = *abi.ConvertType(out[3], new(*big.Int)).(**big.Int)
	outstruct.VerifyingContract = *abi.ConvertType(out[4], new(common.Address)).(*common.Address)
	outstruct.Salt = *abi.ConvertType(out[5], new([32]byte)).(*[32]byte)
	outstruct.Extensions = *abi.ConvertType(out[6], new([]*big.Int)).(*[]*big.Int)

	return *outstruct, err

}

// Eip712Domain is a free data retrieval call binding the contract method 0x84b0196e.
//
// Solidity: function eip712Domain() view returns(bytes1 fields, string name, string version, uint256 chainId, address verifyingContract, bytes32 salt, uint256[] extensions)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) Eip712Domain() (struct {
	Fields            [1]byte
	Name              string
	Version           string
	ChainId           *big.Int
	VerifyingContract common.Address
	Salt              [32]byte
	Extensions        []*big.Int
}, error) {
	return _ERC20UtilityAgent.Contract.Eip712Domain(&_ERC20UtilityAgent.CallOpts)
}

// Eip712Domain is a free data retrieval call binding the contract method 0x84b0196e.
//
// Solidity: function eip712Domain() view returns(bytes1 fields, string name, string version, uint256 chainId, address verifyingContract, bytes32 salt, uint256[] extensions)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) Eip712Domain() (struct {
	Fields            [1]byte
	Name              string
	Version           string
	ChainId           *big.Int
	VerifyingContract common.Address
	Salt              [32]byte
	Extensions        []*big.Int
}, error) {
	return _ERC20UtilityAgent.Contract.Eip712Domain(&_ERC20UtilityAgent.CallOpts)
}

// FetchCode is a free data retrieval call binding the contract method 0x1d959e5d.
//
// Solidity: function fetchCode() view returns(string logic)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) FetchCode(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "fetchCode")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// FetchCode is a free data retrieval call binding the contract method 0x1d959e5d.
//
// Solidity: function fetchCode() view returns(string logic)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) FetchCode() (string, error) {
	return _ERC20UtilityAgent.Contract.FetchCode(&_ERC20UtilityAgent.CallOpts)
}

// FetchCode is a free data retrieval call binding the contract method 0x1d959e5d.
//
// Solidity: function fetchCode() view returns(string logic)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) FetchCode() (string, error) {
	return _ERC20UtilityAgent.Contract.FetchCode(&_ERC20UtilityAgent.CallOpts)
}

// GetFileStorageChunkInfo is a free data retrieval call binding the contract method 0xb213c508.
//
// Solidity: function getFileStorageChunkInfo() view returns((uint256,(address,uint32,uint32)[]) file)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) GetFileStorageChunkInfo(opts *bind.CallOpts) (File, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "getFileStorageChunkInfo")

	if err != nil {
		return *new(File), err
	}

	out0 := *abi.ConvertType(out[0], new(File)).(*File)

	return out0, err

}

// GetFileStorageChunkInfo is a free data retrieval call binding the contract method 0xb213c508.
//
// Solidity: function getFileStorageChunkInfo() view returns((uint256,(address,uint32,uint32)[]) file)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) GetFileStorageChunkInfo() (File, error) {
	return _ERC20UtilityAgent.Contract.GetFileStorageChunkInfo(&_ERC20UtilityAgent.CallOpts)
}

// GetFileStorageChunkInfo is a free data retrieval call binding the contract method 0xb213c508.
//
// Solidity: function getFileStorageChunkInfo() view returns((uint256,(address,uint32,uint32)[]) file)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) GetFileStorageChunkInfo() (File, error) {
	return _ERC20UtilityAgent.Contract.GetFileStorageChunkInfo(&_ERC20UtilityAgent.CallOpts)
}

// GetPastTotalSupply is a free data retrieval call binding the contract method 0x8e539e8c.
//
// Solidity: function getPastTotalSupply(uint256 timepoint) view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) GetPastTotalSupply(opts *bind.CallOpts, timepoint *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "getPastTotalSupply", timepoint)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetPastTotalSupply is a free data retrieval call binding the contract method 0x8e539e8c.
//
// Solidity: function getPastTotalSupply(uint256 timepoint) view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) GetPastTotalSupply(timepoint *big.Int) (*big.Int, error) {
	return _ERC20UtilityAgent.Contract.GetPastTotalSupply(&_ERC20UtilityAgent.CallOpts, timepoint)
}

// GetPastTotalSupply is a free data retrieval call binding the contract method 0x8e539e8c.
//
// Solidity: function getPastTotalSupply(uint256 timepoint) view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) GetPastTotalSupply(timepoint *big.Int) (*big.Int, error) {
	return _ERC20UtilityAgent.Contract.GetPastTotalSupply(&_ERC20UtilityAgent.CallOpts, timepoint)
}

// GetPastVotes is a free data retrieval call binding the contract method 0x3a46b1a8.
//
// Solidity: function getPastVotes(address account, uint256 timepoint) view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) GetPastVotes(opts *bind.CallOpts, account common.Address, timepoint *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "getPastVotes", account, timepoint)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetPastVotes is a free data retrieval call binding the contract method 0x3a46b1a8.
//
// Solidity: function getPastVotes(address account, uint256 timepoint) view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) GetPastVotes(account common.Address, timepoint *big.Int) (*big.Int, error) {
	return _ERC20UtilityAgent.Contract.GetPastVotes(&_ERC20UtilityAgent.CallOpts, account, timepoint)
}

// GetPastVotes is a free data retrieval call binding the contract method 0x3a46b1a8.
//
// Solidity: function getPastVotes(address account, uint256 timepoint) view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) GetPastVotes(account common.Address, timepoint *big.Int) (*big.Int, error) {
	return _ERC20UtilityAgent.Contract.GetPastVotes(&_ERC20UtilityAgent.CallOpts, account, timepoint)
}

// GetResultById is a free data retrieval call binding the contract method 0x08112bdf.
//
// Solidity: function getResultById(uint256 id) view returns(bytes)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) GetResultById(opts *bind.CallOpts, id *big.Int) ([]byte, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "getResultById", id)

	if err != nil {
		return *new([]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([]byte)).(*[]byte)

	return out0, err

}

// GetResultById is a free data retrieval call binding the contract method 0x08112bdf.
//
// Solidity: function getResultById(uint256 id) view returns(bytes)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) GetResultById(id *big.Int) ([]byte, error) {
	return _ERC20UtilityAgent.Contract.GetResultById(&_ERC20UtilityAgent.CallOpts, id)
}

// GetResultById is a free data retrieval call binding the contract method 0x08112bdf.
//
// Solidity: function getResultById(uint256 id) view returns(bytes)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) GetResultById(id *big.Int) ([]byte, error) {
	return _ERC20UtilityAgent.Contract.GetResultById(&_ERC20UtilityAgent.CallOpts, id)
}

// GetResultById0 is a free data retrieval call binding the contract method 0x365bec7f.
//
// Solidity: function getResultById(bytes32 uuid) view returns(bytes)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) GetResultById0(opts *bind.CallOpts, uuid [32]byte) ([]byte, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "getResultById0", uuid)

	if err != nil {
		return *new([]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([]byte)).(*[]byte)

	return out0, err

}

// GetResultById0 is a free data retrieval call binding the contract method 0x365bec7f.
//
// Solidity: function getResultById(bytes32 uuid) view returns(bytes)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) GetResultById0(uuid [32]byte) ([]byte, error) {
	return _ERC20UtilityAgent.Contract.GetResultById0(&_ERC20UtilityAgent.CallOpts, uuid)
}

// GetResultById0 is a free data retrieval call binding the contract method 0x365bec7f.
//
// Solidity: function getResultById(bytes32 uuid) view returns(bytes)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) GetResultById0(uuid [32]byte) ([]byte, error) {
	return _ERC20UtilityAgent.Contract.GetResultById0(&_ERC20UtilityAgent.CallOpts, uuid)
}

// GetStorageInfo is a free data retrieval call binding the contract method 0xe702c420.
//
// Solidity: function getStorageInfo() view returns((address,string))
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) GetStorageInfo(opts *bind.CallOpts) (IUtilityAgentStorageInfo, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "getStorageInfo")

	if err != nil {
		return *new(IUtilityAgentStorageInfo), err
	}

	out0 := *abi.ConvertType(out[0], new(IUtilityAgentStorageInfo)).(*IUtilityAgentStorageInfo)

	return out0, err

}

// GetStorageInfo is a free data retrieval call binding the contract method 0xe702c420.
//
// Solidity: function getStorageInfo() view returns((address,string))
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) GetStorageInfo() (IUtilityAgentStorageInfo, error) {
	return _ERC20UtilityAgent.Contract.GetStorageInfo(&_ERC20UtilityAgent.CallOpts)
}

// GetStorageInfo is a free data retrieval call binding the contract method 0xe702c420.
//
// Solidity: function getStorageInfo() view returns((address,string))
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) GetStorageInfo() (IUtilityAgentStorageInfo, error) {
	return _ERC20UtilityAgent.Contract.GetStorageInfo(&_ERC20UtilityAgent.CallOpts)
}

// GetStorageMode is a free data retrieval call binding the contract method 0x481622f9.
//
// Solidity: function getStorageMode() view returns(string)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) GetStorageMode(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "getStorageMode")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// GetStorageMode is a free data retrieval call binding the contract method 0x481622f9.
//
// Solidity: function getStorageMode() view returns(string)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) GetStorageMode() (string, error) {
	return _ERC20UtilityAgent.Contract.GetStorageMode(&_ERC20UtilityAgent.CallOpts)
}

// GetStorageMode is a free data retrieval call binding the contract method 0x481622f9.
//
// Solidity: function getStorageMode() view returns(string)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) GetStorageMode() (string, error) {
	return _ERC20UtilityAgent.Contract.GetStorageMode(&_ERC20UtilityAgent.CallOpts)
}

// GetSystemPrompt is a free data retrieval call binding the contract method 0x07679a64.
//
// Solidity: function getSystemPrompt() view returns(string)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) GetSystemPrompt(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "getSystemPrompt")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// GetSystemPrompt is a free data retrieval call binding the contract method 0x07679a64.
//
// Solidity: function getSystemPrompt() view returns(string)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) GetSystemPrompt() (string, error) {
	return _ERC20UtilityAgent.Contract.GetSystemPrompt(&_ERC20UtilityAgent.CallOpts)
}

// GetSystemPrompt is a free data retrieval call binding the contract method 0x07679a64.
//
// Solidity: function getSystemPrompt() view returns(string)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) GetSystemPrompt() (string, error) {
	return _ERC20UtilityAgent.Contract.GetSystemPrompt(&_ERC20UtilityAgent.CallOpts)
}

// GetVotes is a free data retrieval call binding the contract method 0x9ab24eb0.
//
// Solidity: function getVotes(address account) view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) GetVotes(opts *bind.CallOpts, account common.Address) (*big.Int, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "getVotes", account)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetVotes is a free data retrieval call binding the contract method 0x9ab24eb0.
//
// Solidity: function getVotes(address account) view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) GetVotes(account common.Address) (*big.Int, error) {
	return _ERC20UtilityAgent.Contract.GetVotes(&_ERC20UtilityAgent.CallOpts, account)
}

// GetVotes is a free data retrieval call binding the contract method 0x9ab24eb0.
//
// Solidity: function getVotes(address account) view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) GetVotes(account common.Address) (*big.Int, error) {
	return _ERC20UtilityAgent.Contract.GetVotes(&_ERC20UtilityAgent.CallOpts, account)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) Name(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "name")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) Name() (string, error) {
	return _ERC20UtilityAgent.Contract.Name(&_ERC20UtilityAgent.CallOpts)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) Name() (string, error) {
	return _ERC20UtilityAgent.Contract.Name(&_ERC20UtilityAgent.CallOpts)
}

// Nonces is a free data retrieval call binding the contract method 0x7ecebe00.
//
// Solidity: function nonces(address owner) view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) Nonces(opts *bind.CallOpts, owner common.Address) (*big.Int, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "nonces", owner)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// Nonces is a free data retrieval call binding the contract method 0x7ecebe00.
//
// Solidity: function nonces(address owner) view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) Nonces(owner common.Address) (*big.Int, error) {
	return _ERC20UtilityAgent.Contract.Nonces(&_ERC20UtilityAgent.CallOpts, owner)
}

// Nonces is a free data retrieval call binding the contract method 0x7ecebe00.
//
// Solidity: function nonces(address owner) view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) Nonces(owner common.Address) (*big.Int, error) {
	return _ERC20UtilityAgent.Contract.Nonces(&_ERC20UtilityAgent.CallOpts, owner)
}

// NumCheckpoints is a free data retrieval call binding the contract method 0x6fcfff45.
//
// Solidity: function numCheckpoints(address account) view returns(uint32)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) NumCheckpoints(opts *bind.CallOpts, account common.Address) (uint32, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "numCheckpoints", account)

	if err != nil {
		return *new(uint32), err
	}

	out0 := *abi.ConvertType(out[0], new(uint32)).(*uint32)

	return out0, err

}

// NumCheckpoints is a free data retrieval call binding the contract method 0x6fcfff45.
//
// Solidity: function numCheckpoints(address account) view returns(uint32)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) NumCheckpoints(account common.Address) (uint32, error) {
	return _ERC20UtilityAgent.Contract.NumCheckpoints(&_ERC20UtilityAgent.CallOpts, account)
}

// NumCheckpoints is a free data retrieval call binding the contract method 0x6fcfff45.
//
// Solidity: function numCheckpoints(address account) view returns(uint32)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) NumCheckpoints(account common.Address) (uint32, error) {
	return _ERC20UtilityAgent.Contract.NumCheckpoints(&_ERC20UtilityAgent.CallOpts, account)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) Owner() (common.Address, error) {
	return _ERC20UtilityAgent.Contract.Owner(&_ERC20UtilityAgent.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) Owner() (common.Address, error) {
	return _ERC20UtilityAgent.Contract.Owner(&_ERC20UtilityAgent.CallOpts)
}

// Symbol is a free data retrieval call binding the contract method 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) Symbol(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "symbol")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Symbol is a free data retrieval call binding the contract method 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) Symbol() (string, error) {
	return _ERC20UtilityAgent.Contract.Symbol(&_ERC20UtilityAgent.CallOpts)
}

// Symbol is a free data retrieval call binding the contract method 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) Symbol() (string, error) {
	return _ERC20UtilityAgent.Contract.Symbol(&_ERC20UtilityAgent.CallOpts)
}

// TotalSupply is a free data retrieval call binding the contract method 0x18160ddd.
//
// Solidity: function totalSupply() view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentCaller) TotalSupply(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _ERC20UtilityAgent.contract.Call(opts, &out, "totalSupply")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// TotalSupply is a free data retrieval call binding the contract method 0x18160ddd.
//
// Solidity: function totalSupply() view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) TotalSupply() (*big.Int, error) {
	return _ERC20UtilityAgent.Contract.TotalSupply(&_ERC20UtilityAgent.CallOpts)
}

// TotalSupply is a free data retrieval call binding the contract method 0x18160ddd.
//
// Solidity: function totalSupply() view returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentCallerSession) TotalSupply() (*big.Int, error) {
	return _ERC20UtilityAgent.Contract.TotalSupply(&_ERC20UtilityAgent.CallOpts)
}

// Approve is a paid mutator transaction binding the contract method 0x095ea7b3.
//
// Solidity: function approve(address spender, uint256 amount) returns(bool)
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactor) Approve(opts *bind.TransactOpts, spender common.Address, amount *big.Int) (*types.Transaction, error) {
	return _ERC20UtilityAgent.contract.Transact(opts, "approve", spender, amount)
}

// Approve is a paid mutator transaction binding the contract method 0x095ea7b3.
//
// Solidity: function approve(address spender, uint256 amount) returns(bool)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) Approve(spender common.Address, amount *big.Int) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.Approve(&_ERC20UtilityAgent.TransactOpts, spender, amount)
}

// Approve is a paid mutator transaction binding the contract method 0x095ea7b3.
//
// Solidity: function approve(address spender, uint256 amount) returns(bool)
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactorSession) Approve(spender common.Address, amount *big.Int) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.Approve(&_ERC20UtilityAgent.TransactOpts, spender, amount)
}

// DecreaseAllowance is a paid mutator transaction binding the contract method 0xa457c2d7.
//
// Solidity: function decreaseAllowance(address spender, uint256 subtractedValue) returns(bool)
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactor) DecreaseAllowance(opts *bind.TransactOpts, spender common.Address, subtractedValue *big.Int) (*types.Transaction, error) {
	return _ERC20UtilityAgent.contract.Transact(opts, "decreaseAllowance", spender, subtractedValue)
}

// DecreaseAllowance is a paid mutator transaction binding the contract method 0xa457c2d7.
//
// Solidity: function decreaseAllowance(address spender, uint256 subtractedValue) returns(bool)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) DecreaseAllowance(spender common.Address, subtractedValue *big.Int) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.DecreaseAllowance(&_ERC20UtilityAgent.TransactOpts, spender, subtractedValue)
}

// DecreaseAllowance is a paid mutator transaction binding the contract method 0xa457c2d7.
//
// Solidity: function decreaseAllowance(address spender, uint256 subtractedValue) returns(bool)
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactorSession) DecreaseAllowance(spender common.Address, subtractedValue *big.Int) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.DecreaseAllowance(&_ERC20UtilityAgent.TransactOpts, spender, subtractedValue)
}

// Delegate is a paid mutator transaction binding the contract method 0x5c19a95c.
//
// Solidity: function delegate(address delegatee) returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactor) Delegate(opts *bind.TransactOpts, delegatee common.Address) (*types.Transaction, error) {
	return _ERC20UtilityAgent.contract.Transact(opts, "delegate", delegatee)
}

// Delegate is a paid mutator transaction binding the contract method 0x5c19a95c.
//
// Solidity: function delegate(address delegatee) returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) Delegate(delegatee common.Address) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.Delegate(&_ERC20UtilityAgent.TransactOpts, delegatee)
}

// Delegate is a paid mutator transaction binding the contract method 0x5c19a95c.
//
// Solidity: function delegate(address delegatee) returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactorSession) Delegate(delegatee common.Address) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.Delegate(&_ERC20UtilityAgent.TransactOpts, delegatee)
}

// DelegateBySig is a paid mutator transaction binding the contract method 0xc3cda520.
//
// Solidity: function delegateBySig(address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactor) DelegateBySig(opts *bind.TransactOpts, delegatee common.Address, nonce *big.Int, expiry *big.Int, v uint8, r [32]byte, s [32]byte) (*types.Transaction, error) {
	return _ERC20UtilityAgent.contract.Transact(opts, "delegateBySig", delegatee, nonce, expiry, v, r, s)
}

// DelegateBySig is a paid mutator transaction binding the contract method 0xc3cda520.
//
// Solidity: function delegateBySig(address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) DelegateBySig(delegatee common.Address, nonce *big.Int, expiry *big.Int, v uint8, r [32]byte, s [32]byte) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.DelegateBySig(&_ERC20UtilityAgent.TransactOpts, delegatee, nonce, expiry, v, r, s)
}

// DelegateBySig is a paid mutator transaction binding the contract method 0xc3cda520.
//
// Solidity: function delegateBySig(address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactorSession) DelegateBySig(delegatee common.Address, nonce *big.Int, expiry *big.Int, v uint8, r [32]byte, s [32]byte) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.DelegateBySig(&_ERC20UtilityAgent.TransactOpts, delegatee, nonce, expiry, v, r, s)
}

// Forward is a paid mutator transaction binding the contract method 0xf514b5b8.
//
// Solidity: function forward(bytes32 uuid, address dstAgent, bytes request) payable returns(uint256 dstActionId)
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactor) Forward(opts *bind.TransactOpts, uuid [32]byte, dstAgent common.Address, request []byte) (*types.Transaction, error) {
	return _ERC20UtilityAgent.contract.Transact(opts, "forward", uuid, dstAgent, request)
}

// Forward is a paid mutator transaction binding the contract method 0xf514b5b8.
//
// Solidity: function forward(bytes32 uuid, address dstAgent, bytes request) payable returns(uint256 dstActionId)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) Forward(uuid [32]byte, dstAgent common.Address, request []byte) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.Forward(&_ERC20UtilityAgent.TransactOpts, uuid, dstAgent, request)
}

// Forward is a paid mutator transaction binding the contract method 0xf514b5b8.
//
// Solidity: function forward(bytes32 uuid, address dstAgent, bytes request) payable returns(uint256 dstActionId)
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactorSession) Forward(uuid [32]byte, dstAgent common.Address, request []byte) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.Forward(&_ERC20UtilityAgent.TransactOpts, uuid, dstAgent, request)
}

// IncreaseAllowance is a paid mutator transaction binding the contract method 0x39509351.
//
// Solidity: function increaseAllowance(address spender, uint256 addedValue) returns(bool)
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactor) IncreaseAllowance(opts *bind.TransactOpts, spender common.Address, addedValue *big.Int) (*types.Transaction, error) {
	return _ERC20UtilityAgent.contract.Transact(opts, "increaseAllowance", spender, addedValue)
}

// IncreaseAllowance is a paid mutator transaction binding the contract method 0x39509351.
//
// Solidity: function increaseAllowance(address spender, uint256 addedValue) returns(bool)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) IncreaseAllowance(spender common.Address, addedValue *big.Int) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.IncreaseAllowance(&_ERC20UtilityAgent.TransactOpts, spender, addedValue)
}

// IncreaseAllowance is a paid mutator transaction binding the contract method 0x39509351.
//
// Solidity: function increaseAllowance(address spender, uint256 addedValue) returns(bool)
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactorSession) IncreaseAllowance(spender common.Address, addedValue *big.Int) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.IncreaseAllowance(&_ERC20UtilityAgent.TransactOpts, spender, addedValue)
}

// Permit is a paid mutator transaction binding the contract method 0xd505accf.
//
// Solidity: function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactor) Permit(opts *bind.TransactOpts, owner common.Address, spender common.Address, value *big.Int, deadline *big.Int, v uint8, r [32]byte, s [32]byte) (*types.Transaction, error) {
	return _ERC20UtilityAgent.contract.Transact(opts, "permit", owner, spender, value, deadline, v, r, s)
}

// Permit is a paid mutator transaction binding the contract method 0xd505accf.
//
// Solidity: function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) Permit(owner common.Address, spender common.Address, value *big.Int, deadline *big.Int, v uint8, r [32]byte, s [32]byte) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.Permit(&_ERC20UtilityAgent.TransactOpts, owner, spender, value, deadline, v, r, s)
}

// Permit is a paid mutator transaction binding the contract method 0xd505accf.
//
// Solidity: function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactorSession) Permit(owner common.Address, spender common.Address, value *big.Int, deadline *big.Int, v uint8, r [32]byte, s [32]byte) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.Permit(&_ERC20UtilityAgent.TransactOpts, owner, spender, value, deadline, v, r, s)
}

// Prompt is a paid mutator transaction binding the contract method 0x793042c9.
//
// Solidity: function prompt(bytes request) payable returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactor) Prompt(opts *bind.TransactOpts, request []byte) (*types.Transaction, error) {
	return _ERC20UtilityAgent.contract.Transact(opts, "prompt", request)
}

// Prompt is a paid mutator transaction binding the contract method 0x793042c9.
//
// Solidity: function prompt(bytes request) payable returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) Prompt(request []byte) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.Prompt(&_ERC20UtilityAgent.TransactOpts, request)
}

// Prompt is a paid mutator transaction binding the contract method 0x793042c9.
//
// Solidity: function prompt(bytes request) payable returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactorSession) Prompt(request []byte) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.Prompt(&_ERC20UtilityAgent.TransactOpts, request)
}

// Prompt0 is a paid mutator transaction binding the contract method 0xbe16d94a.
//
// Solidity: function prompt(bytes32 uuid, bytes request) payable returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactor) Prompt0(opts *bind.TransactOpts, uuid [32]byte, request []byte) (*types.Transaction, error) {
	return _ERC20UtilityAgent.contract.Transact(opts, "prompt0", uuid, request)
}

// Prompt0 is a paid mutator transaction binding the contract method 0xbe16d94a.
//
// Solidity: function prompt(bytes32 uuid, bytes request) payable returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) Prompt0(uuid [32]byte, request []byte) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.Prompt0(&_ERC20UtilityAgent.TransactOpts, uuid, request)
}

// Prompt0 is a paid mutator transaction binding the contract method 0xbe16d94a.
//
// Solidity: function prompt(bytes32 uuid, bytes request) payable returns(uint256)
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactorSession) Prompt0(uuid [32]byte, request []byte) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.Prompt0(&_ERC20UtilityAgent.TransactOpts, uuid, request)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _ERC20UtilityAgent.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) RenounceOwnership() (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.RenounceOwnership(&_ERC20UtilityAgent.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.RenounceOwnership(&_ERC20UtilityAgent.TransactOpts)
}

// Transfer is a paid mutator transaction binding the contract method 0xa9059cbb.
//
// Solidity: function transfer(address to, uint256 amount) returns(bool)
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactor) Transfer(opts *bind.TransactOpts, to common.Address, amount *big.Int) (*types.Transaction, error) {
	return _ERC20UtilityAgent.contract.Transact(opts, "transfer", to, amount)
}

// Transfer is a paid mutator transaction binding the contract method 0xa9059cbb.
//
// Solidity: function transfer(address to, uint256 amount) returns(bool)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) Transfer(to common.Address, amount *big.Int) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.Transfer(&_ERC20UtilityAgent.TransactOpts, to, amount)
}

// Transfer is a paid mutator transaction binding the contract method 0xa9059cbb.
//
// Solidity: function transfer(address to, uint256 amount) returns(bool)
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactorSession) Transfer(to common.Address, amount *big.Int) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.Transfer(&_ERC20UtilityAgent.TransactOpts, to, amount)
}

// TransferFrom is a paid mutator transaction binding the contract method 0x23b872dd.
//
// Solidity: function transferFrom(address from, address to, uint256 amount) returns(bool)
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactor) TransferFrom(opts *bind.TransactOpts, from common.Address, to common.Address, amount *big.Int) (*types.Transaction, error) {
	return _ERC20UtilityAgent.contract.Transact(opts, "transferFrom", from, to, amount)
}

// TransferFrom is a paid mutator transaction binding the contract method 0x23b872dd.
//
// Solidity: function transferFrom(address from, address to, uint256 amount) returns(bool)
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) TransferFrom(from common.Address, to common.Address, amount *big.Int) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.TransferFrom(&_ERC20UtilityAgent.TransactOpts, from, to, amount)
}

// TransferFrom is a paid mutator transaction binding the contract method 0x23b872dd.
//
// Solidity: function transferFrom(address from, address to, uint256 amount) returns(bool)
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactorSession) TransferFrom(from common.Address, to common.Address, amount *big.Int) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.TransferFrom(&_ERC20UtilityAgent.TransactOpts, from, to, amount)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _ERC20UtilityAgent.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.TransferOwnership(&_ERC20UtilityAgent.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.TransferOwnership(&_ERC20UtilityAgent.TransactOpts, newOwner)
}

// UpdateFileName is a paid mutator transaction binding the contract method 0xf73eb6f3.
//
// Solidity: function updateFileName(string filename) returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactor) UpdateFileName(opts *bind.TransactOpts, filename string) (*types.Transaction, error) {
	return _ERC20UtilityAgent.contract.Transact(opts, "updateFileName", filename)
}

// UpdateFileName is a paid mutator transaction binding the contract method 0xf73eb6f3.
//
// Solidity: function updateFileName(string filename) returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) UpdateFileName(filename string) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.UpdateFileName(&_ERC20UtilityAgent.TransactOpts, filename)
}

// UpdateFileName is a paid mutator transaction binding the contract method 0xf73eb6f3.
//
// Solidity: function updateFileName(string filename) returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactorSession) UpdateFileName(filename string) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.UpdateFileName(&_ERC20UtilityAgent.TransactOpts, filename)
}

// UpdateSystemPrompt is a paid mutator transaction binding the contract method 0x76a30029.
//
// Solidity: function updateSystemPrompt(string systemPrompt) returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactor) UpdateSystemPrompt(opts *bind.TransactOpts, systemPrompt string) (*types.Transaction, error) {
	return _ERC20UtilityAgent.contract.Transact(opts, "updateSystemPrompt", systemPrompt)
}

// UpdateSystemPrompt is a paid mutator transaction binding the contract method 0x76a30029.
//
// Solidity: function updateSystemPrompt(string systemPrompt) returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentSession) UpdateSystemPrompt(systemPrompt string) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.UpdateSystemPrompt(&_ERC20UtilityAgent.TransactOpts, systemPrompt)
}

// UpdateSystemPrompt is a paid mutator transaction binding the contract method 0x76a30029.
//
// Solidity: function updateSystemPrompt(string systemPrompt) returns()
func (_ERC20UtilityAgent *ERC20UtilityAgentTransactorSession) UpdateSystemPrompt(systemPrompt string) (*types.Transaction, error) {
	return _ERC20UtilityAgent.Contract.UpdateSystemPrompt(&_ERC20UtilityAgent.TransactOpts, systemPrompt)
}

// ERC20UtilityAgentApprovalIterator is returned from FilterApproval and is used to iterate over the raw logs and unpacked data for Approval events raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentApprovalIterator struct {
	Event *ERC20UtilityAgentApproval // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ERC20UtilityAgentApprovalIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ERC20UtilityAgentApproval)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(ERC20UtilityAgentApproval)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *ERC20UtilityAgentApprovalIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ERC20UtilityAgentApprovalIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ERC20UtilityAgentApproval represents a Approval event raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentApproval struct {
	Owner   common.Address
	Spender common.Address
	Value   *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterApproval is a free log retrieval operation binding the contract event 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925.
//
// Solidity: event Approval(address indexed owner, address indexed spender, uint256 value)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) FilterApproval(opts *bind.FilterOpts, owner []common.Address, spender []common.Address) (*ERC20UtilityAgentApprovalIterator, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var spenderRule []interface{}
	for _, spenderItem := range spender {
		spenderRule = append(spenderRule, spenderItem)
	}

	logs, sub, err := _ERC20UtilityAgent.contract.FilterLogs(opts, "Approval", ownerRule, spenderRule)
	if err != nil {
		return nil, err
	}
	return &ERC20UtilityAgentApprovalIterator{contract: _ERC20UtilityAgent.contract, event: "Approval", logs: logs, sub: sub}, nil
}

// WatchApproval is a free log subscription operation binding the contract event 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925.
//
// Solidity: event Approval(address indexed owner, address indexed spender, uint256 value)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) WatchApproval(opts *bind.WatchOpts, sink chan<- *ERC20UtilityAgentApproval, owner []common.Address, spender []common.Address) (event.Subscription, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var spenderRule []interface{}
	for _, spenderItem := range spender {
		spenderRule = append(spenderRule, spenderItem)
	}

	logs, sub, err := _ERC20UtilityAgent.contract.WatchLogs(opts, "Approval", ownerRule, spenderRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ERC20UtilityAgentApproval)
				if err := _ERC20UtilityAgent.contract.UnpackLog(event, "Approval", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseApproval is a log parse operation binding the contract event 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925.
//
// Solidity: event Approval(address indexed owner, address indexed spender, uint256 value)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) ParseApproval(log types.Log) (*ERC20UtilityAgentApproval, error) {
	event := new(ERC20UtilityAgentApproval)
	if err := _ERC20UtilityAgent.contract.UnpackLog(event, "Approval", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// ERC20UtilityAgentDelegateChangedIterator is returned from FilterDelegateChanged and is used to iterate over the raw logs and unpacked data for DelegateChanged events raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentDelegateChangedIterator struct {
	Event *ERC20UtilityAgentDelegateChanged // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ERC20UtilityAgentDelegateChangedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ERC20UtilityAgentDelegateChanged)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(ERC20UtilityAgentDelegateChanged)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *ERC20UtilityAgentDelegateChangedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ERC20UtilityAgentDelegateChangedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ERC20UtilityAgentDelegateChanged represents a DelegateChanged event raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentDelegateChanged struct {
	Delegator    common.Address
	FromDelegate common.Address
	ToDelegate   common.Address
	Raw          types.Log // Blockchain specific contextual infos
}

// FilterDelegateChanged is a free log retrieval operation binding the contract event 0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f.
//
// Solidity: event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) FilterDelegateChanged(opts *bind.FilterOpts, delegator []common.Address, fromDelegate []common.Address, toDelegate []common.Address) (*ERC20UtilityAgentDelegateChangedIterator, error) {

	var delegatorRule []interface{}
	for _, delegatorItem := range delegator {
		delegatorRule = append(delegatorRule, delegatorItem)
	}
	var fromDelegateRule []interface{}
	for _, fromDelegateItem := range fromDelegate {
		fromDelegateRule = append(fromDelegateRule, fromDelegateItem)
	}
	var toDelegateRule []interface{}
	for _, toDelegateItem := range toDelegate {
		toDelegateRule = append(toDelegateRule, toDelegateItem)
	}

	logs, sub, err := _ERC20UtilityAgent.contract.FilterLogs(opts, "DelegateChanged", delegatorRule, fromDelegateRule, toDelegateRule)
	if err != nil {
		return nil, err
	}
	return &ERC20UtilityAgentDelegateChangedIterator{contract: _ERC20UtilityAgent.contract, event: "DelegateChanged", logs: logs, sub: sub}, nil
}

// WatchDelegateChanged is a free log subscription operation binding the contract event 0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f.
//
// Solidity: event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) WatchDelegateChanged(opts *bind.WatchOpts, sink chan<- *ERC20UtilityAgentDelegateChanged, delegator []common.Address, fromDelegate []common.Address, toDelegate []common.Address) (event.Subscription, error) {

	var delegatorRule []interface{}
	for _, delegatorItem := range delegator {
		delegatorRule = append(delegatorRule, delegatorItem)
	}
	var fromDelegateRule []interface{}
	for _, fromDelegateItem := range fromDelegate {
		fromDelegateRule = append(fromDelegateRule, fromDelegateItem)
	}
	var toDelegateRule []interface{}
	for _, toDelegateItem := range toDelegate {
		toDelegateRule = append(toDelegateRule, toDelegateItem)
	}

	logs, sub, err := _ERC20UtilityAgent.contract.WatchLogs(opts, "DelegateChanged", delegatorRule, fromDelegateRule, toDelegateRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ERC20UtilityAgentDelegateChanged)
				if err := _ERC20UtilityAgent.contract.UnpackLog(event, "DelegateChanged", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseDelegateChanged is a log parse operation binding the contract event 0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f.
//
// Solidity: event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) ParseDelegateChanged(log types.Log) (*ERC20UtilityAgentDelegateChanged, error) {
	event := new(ERC20UtilityAgentDelegateChanged)
	if err := _ERC20UtilityAgent.contract.UnpackLog(event, "DelegateChanged", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// ERC20UtilityAgentDelegateVotesChangedIterator is returned from FilterDelegateVotesChanged and is used to iterate over the raw logs and unpacked data for DelegateVotesChanged events raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentDelegateVotesChangedIterator struct {
	Event *ERC20UtilityAgentDelegateVotesChanged // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ERC20UtilityAgentDelegateVotesChangedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ERC20UtilityAgentDelegateVotesChanged)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(ERC20UtilityAgentDelegateVotesChanged)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *ERC20UtilityAgentDelegateVotesChangedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ERC20UtilityAgentDelegateVotesChangedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ERC20UtilityAgentDelegateVotesChanged represents a DelegateVotesChanged event raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentDelegateVotesChanged struct {
	Delegate        common.Address
	PreviousBalance *big.Int
	NewBalance      *big.Int
	Raw             types.Log // Blockchain specific contextual infos
}

// FilterDelegateVotesChanged is a free log retrieval operation binding the contract event 0xdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724.
//
// Solidity: event DelegateVotesChanged(address indexed delegate, uint256 previousBalance, uint256 newBalance)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) FilterDelegateVotesChanged(opts *bind.FilterOpts, delegate []common.Address) (*ERC20UtilityAgentDelegateVotesChangedIterator, error) {

	var delegateRule []interface{}
	for _, delegateItem := range delegate {
		delegateRule = append(delegateRule, delegateItem)
	}

	logs, sub, err := _ERC20UtilityAgent.contract.FilterLogs(opts, "DelegateVotesChanged", delegateRule)
	if err != nil {
		return nil, err
	}
	return &ERC20UtilityAgentDelegateVotesChangedIterator{contract: _ERC20UtilityAgent.contract, event: "DelegateVotesChanged", logs: logs, sub: sub}, nil
}

// WatchDelegateVotesChanged is a free log subscription operation binding the contract event 0xdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724.
//
// Solidity: event DelegateVotesChanged(address indexed delegate, uint256 previousBalance, uint256 newBalance)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) WatchDelegateVotesChanged(opts *bind.WatchOpts, sink chan<- *ERC20UtilityAgentDelegateVotesChanged, delegate []common.Address) (event.Subscription, error) {

	var delegateRule []interface{}
	for _, delegateItem := range delegate {
		delegateRule = append(delegateRule, delegateItem)
	}

	logs, sub, err := _ERC20UtilityAgent.contract.WatchLogs(opts, "DelegateVotesChanged", delegateRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ERC20UtilityAgentDelegateVotesChanged)
				if err := _ERC20UtilityAgent.contract.UnpackLog(event, "DelegateVotesChanged", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseDelegateVotesChanged is a log parse operation binding the contract event 0xdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724.
//
// Solidity: event DelegateVotesChanged(address indexed delegate, uint256 previousBalance, uint256 newBalance)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) ParseDelegateVotesChanged(log types.Log) (*ERC20UtilityAgentDelegateVotesChanged, error) {
	event := new(ERC20UtilityAgentDelegateVotesChanged)
	if err := _ERC20UtilityAgent.contract.UnpackLog(event, "DelegateVotesChanged", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// ERC20UtilityAgentEIP712DomainChangedIterator is returned from FilterEIP712DomainChanged and is used to iterate over the raw logs and unpacked data for EIP712DomainChanged events raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentEIP712DomainChangedIterator struct {
	Event *ERC20UtilityAgentEIP712DomainChanged // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ERC20UtilityAgentEIP712DomainChangedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ERC20UtilityAgentEIP712DomainChanged)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(ERC20UtilityAgentEIP712DomainChanged)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *ERC20UtilityAgentEIP712DomainChangedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ERC20UtilityAgentEIP712DomainChangedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ERC20UtilityAgentEIP712DomainChanged represents a EIP712DomainChanged event raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentEIP712DomainChanged struct {
	Raw types.Log // Blockchain specific contextual infos
}

// FilterEIP712DomainChanged is a free log retrieval operation binding the contract event 0x0a6387c9ea3628b88a633bb4f3b151770f70085117a15f9bf3787cda53f13d31.
//
// Solidity: event EIP712DomainChanged()
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) FilterEIP712DomainChanged(opts *bind.FilterOpts) (*ERC20UtilityAgentEIP712DomainChangedIterator, error) {

	logs, sub, err := _ERC20UtilityAgent.contract.FilterLogs(opts, "EIP712DomainChanged")
	if err != nil {
		return nil, err
	}
	return &ERC20UtilityAgentEIP712DomainChangedIterator{contract: _ERC20UtilityAgent.contract, event: "EIP712DomainChanged", logs: logs, sub: sub}, nil
}

// WatchEIP712DomainChanged is a free log subscription operation binding the contract event 0x0a6387c9ea3628b88a633bb4f3b151770f70085117a15f9bf3787cda53f13d31.
//
// Solidity: event EIP712DomainChanged()
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) WatchEIP712DomainChanged(opts *bind.WatchOpts, sink chan<- *ERC20UtilityAgentEIP712DomainChanged) (event.Subscription, error) {

	logs, sub, err := _ERC20UtilityAgent.contract.WatchLogs(opts, "EIP712DomainChanged")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ERC20UtilityAgentEIP712DomainChanged)
				if err := _ERC20UtilityAgent.contract.UnpackLog(event, "EIP712DomainChanged", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseEIP712DomainChanged is a log parse operation binding the contract event 0x0a6387c9ea3628b88a633bb4f3b151770f70085117a15f9bf3787cda53f13d31.
//
// Solidity: event EIP712DomainChanged()
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) ParseEIP712DomainChanged(log types.Log) (*ERC20UtilityAgentEIP712DomainChanged, error) {
	event := new(ERC20UtilityAgentEIP712DomainChanged)
	if err := _ERC20UtilityAgent.contract.UnpackLog(event, "EIP712DomainChanged", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// ERC20UtilityAgentForwardPerformedIterator is returned from FilterForwardPerformed and is used to iterate over the raw logs and unpacked data for ForwardPerformed events raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentForwardPerformedIterator struct {
	Event *ERC20UtilityAgentForwardPerformed // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ERC20UtilityAgentForwardPerformedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ERC20UtilityAgentForwardPerformed)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(ERC20UtilityAgentForwardPerformed)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *ERC20UtilityAgentForwardPerformedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ERC20UtilityAgentForwardPerformedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ERC20UtilityAgentForwardPerformed represents a ForwardPerformed event raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentForwardPerformed struct {
	Uuid       [32]byte
	InferId    *big.Int
	Caller     common.Address
	FowardData []byte
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterForwardPerformed is a free log retrieval operation binding the contract event 0x103ab115fdd2f05d2720873cd21aeff07c1206de37259cdeb99463da9ff512e0.
//
// Solidity: event ForwardPerformed(bytes32 indexed uuid, uint256 indexed inferId, address indexed caller, bytes fowardData)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) FilterForwardPerformed(opts *bind.FilterOpts, uuid [][32]byte, inferId []*big.Int, caller []common.Address) (*ERC20UtilityAgentForwardPerformedIterator, error) {

	var uuidRule []interface{}
	for _, uuidItem := range uuid {
		uuidRule = append(uuidRule, uuidItem)
	}
	var inferIdRule []interface{}
	for _, inferIdItem := range inferId {
		inferIdRule = append(inferIdRule, inferIdItem)
	}
	var callerRule []interface{}
	for _, callerItem := range caller {
		callerRule = append(callerRule, callerItem)
	}

	logs, sub, err := _ERC20UtilityAgent.contract.FilterLogs(opts, "ForwardPerformed", uuidRule, inferIdRule, callerRule)
	if err != nil {
		return nil, err
	}
	return &ERC20UtilityAgentForwardPerformedIterator{contract: _ERC20UtilityAgent.contract, event: "ForwardPerformed", logs: logs, sub: sub}, nil
}

// WatchForwardPerformed is a free log subscription operation binding the contract event 0x103ab115fdd2f05d2720873cd21aeff07c1206de37259cdeb99463da9ff512e0.
//
// Solidity: event ForwardPerformed(bytes32 indexed uuid, uint256 indexed inferId, address indexed caller, bytes fowardData)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) WatchForwardPerformed(opts *bind.WatchOpts, sink chan<- *ERC20UtilityAgentForwardPerformed, uuid [][32]byte, inferId []*big.Int, caller []common.Address) (event.Subscription, error) {

	var uuidRule []interface{}
	for _, uuidItem := range uuid {
		uuidRule = append(uuidRule, uuidItem)
	}
	var inferIdRule []interface{}
	for _, inferIdItem := range inferId {
		inferIdRule = append(inferIdRule, inferIdItem)
	}
	var callerRule []interface{}
	for _, callerItem := range caller {
		callerRule = append(callerRule, callerItem)
	}

	logs, sub, err := _ERC20UtilityAgent.contract.WatchLogs(opts, "ForwardPerformed", uuidRule, inferIdRule, callerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ERC20UtilityAgentForwardPerformed)
				if err := _ERC20UtilityAgent.contract.UnpackLog(event, "ForwardPerformed", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseForwardPerformed is a log parse operation binding the contract event 0x103ab115fdd2f05d2720873cd21aeff07c1206de37259cdeb99463da9ff512e0.
//
// Solidity: event ForwardPerformed(bytes32 indexed uuid, uint256 indexed inferId, address indexed caller, bytes fowardData)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) ParseForwardPerformed(log types.Log) (*ERC20UtilityAgentForwardPerformed, error) {
	event := new(ERC20UtilityAgentForwardPerformed)
	if err := _ERC20UtilityAgent.contract.UnpackLog(event, "ForwardPerformed", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// ERC20UtilityAgentModelUpdateIterator is returned from FilterModelUpdate and is used to iterate over the raw logs and unpacked data for ModelUpdate events raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentModelUpdateIterator struct {
	Event *ERC20UtilityAgentModelUpdate // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ERC20UtilityAgentModelUpdateIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ERC20UtilityAgentModelUpdate)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(ERC20UtilityAgentModelUpdate)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *ERC20UtilityAgentModelUpdateIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ERC20UtilityAgentModelUpdateIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ERC20UtilityAgentModelUpdate represents a ModelUpdate event raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentModelUpdate struct {
	HybridModel common.Address
	Raw         types.Log // Blockchain specific contextual infos
}

// FilterModelUpdate is a free log retrieval operation binding the contract event 0x9e53d9893c64d113368e7309f92b28e4c2f58b339f6e7878fa0d519851c0041e.
//
// Solidity: event ModelUpdate(address hybridModel)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) FilterModelUpdate(opts *bind.FilterOpts) (*ERC20UtilityAgentModelUpdateIterator, error) {

	logs, sub, err := _ERC20UtilityAgent.contract.FilterLogs(opts, "ModelUpdate")
	if err != nil {
		return nil, err
	}
	return &ERC20UtilityAgentModelUpdateIterator{contract: _ERC20UtilityAgent.contract, event: "ModelUpdate", logs: logs, sub: sub}, nil
}

// WatchModelUpdate is a free log subscription operation binding the contract event 0x9e53d9893c64d113368e7309f92b28e4c2f58b339f6e7878fa0d519851c0041e.
//
// Solidity: event ModelUpdate(address hybridModel)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) WatchModelUpdate(opts *bind.WatchOpts, sink chan<- *ERC20UtilityAgentModelUpdate) (event.Subscription, error) {

	logs, sub, err := _ERC20UtilityAgent.contract.WatchLogs(opts, "ModelUpdate")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ERC20UtilityAgentModelUpdate)
				if err := _ERC20UtilityAgent.contract.UnpackLog(event, "ModelUpdate", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseModelUpdate is a log parse operation binding the contract event 0x9e53d9893c64d113368e7309f92b28e4c2f58b339f6e7878fa0d519851c0041e.
//
// Solidity: event ModelUpdate(address hybridModel)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) ParseModelUpdate(log types.Log) (*ERC20UtilityAgentModelUpdate, error) {
	event := new(ERC20UtilityAgentModelUpdate)
	if err := _ERC20UtilityAgent.contract.UnpackLog(event, "ModelUpdate", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// ERC20UtilityAgentOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentOwnershipTransferredIterator struct {
	Event *ERC20UtilityAgentOwnershipTransferred // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ERC20UtilityAgentOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ERC20UtilityAgentOwnershipTransferred)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(ERC20UtilityAgentOwnershipTransferred)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *ERC20UtilityAgentOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ERC20UtilityAgentOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ERC20UtilityAgentOwnershipTransferred represents a OwnershipTransferred event raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*ERC20UtilityAgentOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _ERC20UtilityAgent.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &ERC20UtilityAgentOwnershipTransferredIterator{contract: _ERC20UtilityAgent.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *ERC20UtilityAgentOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _ERC20UtilityAgent.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ERC20UtilityAgentOwnershipTransferred)
				if err := _ERC20UtilityAgent.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseOwnershipTransferred is a log parse operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) ParseOwnershipTransferred(log types.Log) (*ERC20UtilityAgentOwnershipTransferred, error) {
	event := new(ERC20UtilityAgentOwnershipTransferred)
	if err := _ERC20UtilityAgent.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// ERC20UtilityAgentPromptPerformedIterator is returned from FilterPromptPerformed and is used to iterate over the raw logs and unpacked data for PromptPerformed events raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentPromptPerformedIterator struct {
	Event *ERC20UtilityAgentPromptPerformed // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ERC20UtilityAgentPromptPerformedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ERC20UtilityAgentPromptPerformed)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(ERC20UtilityAgentPromptPerformed)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *ERC20UtilityAgentPromptPerformedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ERC20UtilityAgentPromptPerformedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ERC20UtilityAgentPromptPerformed represents a PromptPerformed event raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentPromptPerformed struct {
	Uuid          [32]byte
	InferId       *big.Int
	Caller        common.Address
	ExecutionData []byte
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterPromptPerformed is a free log retrieval operation binding the contract event 0x71f71bde9af581324eb3d6c8f96ecf2d5af870ec81503e21f44ed8dd3574f99e.
//
// Solidity: event PromptPerformed(bytes32 indexed uuid, uint256 indexed inferId, address indexed caller, bytes executionData)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) FilterPromptPerformed(opts *bind.FilterOpts, uuid [][32]byte, inferId []*big.Int, caller []common.Address) (*ERC20UtilityAgentPromptPerformedIterator, error) {

	var uuidRule []interface{}
	for _, uuidItem := range uuid {
		uuidRule = append(uuidRule, uuidItem)
	}
	var inferIdRule []interface{}
	for _, inferIdItem := range inferId {
		inferIdRule = append(inferIdRule, inferIdItem)
	}
	var callerRule []interface{}
	for _, callerItem := range caller {
		callerRule = append(callerRule, callerItem)
	}

	logs, sub, err := _ERC20UtilityAgent.contract.FilterLogs(opts, "PromptPerformed", uuidRule, inferIdRule, callerRule)
	if err != nil {
		return nil, err
	}
	return &ERC20UtilityAgentPromptPerformedIterator{contract: _ERC20UtilityAgent.contract, event: "PromptPerformed", logs: logs, sub: sub}, nil
}

// WatchPromptPerformed is a free log subscription operation binding the contract event 0x71f71bde9af581324eb3d6c8f96ecf2d5af870ec81503e21f44ed8dd3574f99e.
//
// Solidity: event PromptPerformed(bytes32 indexed uuid, uint256 indexed inferId, address indexed caller, bytes executionData)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) WatchPromptPerformed(opts *bind.WatchOpts, sink chan<- *ERC20UtilityAgentPromptPerformed, uuid [][32]byte, inferId []*big.Int, caller []common.Address) (event.Subscription, error) {

	var uuidRule []interface{}
	for _, uuidItem := range uuid {
		uuidRule = append(uuidRule, uuidItem)
	}
	var inferIdRule []interface{}
	for _, inferIdItem := range inferId {
		inferIdRule = append(inferIdRule, inferIdItem)
	}
	var callerRule []interface{}
	for _, callerItem := range caller {
		callerRule = append(callerRule, callerItem)
	}

	logs, sub, err := _ERC20UtilityAgent.contract.WatchLogs(opts, "PromptPerformed", uuidRule, inferIdRule, callerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ERC20UtilityAgentPromptPerformed)
				if err := _ERC20UtilityAgent.contract.UnpackLog(event, "PromptPerformed", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParsePromptPerformed is a log parse operation binding the contract event 0x71f71bde9af581324eb3d6c8f96ecf2d5af870ec81503e21f44ed8dd3574f99e.
//
// Solidity: event PromptPerformed(bytes32 indexed uuid, uint256 indexed inferId, address indexed caller, bytes executionData)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) ParsePromptPerformed(log types.Log) (*ERC20UtilityAgentPromptPerformed, error) {
	event := new(ERC20UtilityAgentPromptPerformed)
	if err := _ERC20UtilityAgent.contract.UnpackLog(event, "PromptPerformed", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// ERC20UtilityAgentPromptSchedulerUpdateIterator is returned from FilterPromptSchedulerUpdate and is used to iterate over the raw logs and unpacked data for PromptSchedulerUpdate events raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentPromptSchedulerUpdateIterator struct {
	Event *ERC20UtilityAgentPromptSchedulerUpdate // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ERC20UtilityAgentPromptSchedulerUpdateIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ERC20UtilityAgentPromptSchedulerUpdate)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(ERC20UtilityAgentPromptSchedulerUpdate)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *ERC20UtilityAgentPromptSchedulerUpdateIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ERC20UtilityAgentPromptSchedulerUpdateIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ERC20UtilityAgentPromptSchedulerUpdate represents a PromptSchedulerUpdate event raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentPromptSchedulerUpdate struct {
	PromptScheduler common.Address
	Raw             types.Log // Blockchain specific contextual infos
}

// FilterPromptSchedulerUpdate is a free log retrieval operation binding the contract event 0x667557d852582e84e7de441f650ea0aacbb7de26e3485436e0c27ba8d19a79f1.
//
// Solidity: event PromptSchedulerUpdate(address promptScheduler)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) FilterPromptSchedulerUpdate(opts *bind.FilterOpts) (*ERC20UtilityAgentPromptSchedulerUpdateIterator, error) {

	logs, sub, err := _ERC20UtilityAgent.contract.FilterLogs(opts, "PromptSchedulerUpdate")
	if err != nil {
		return nil, err
	}
	return &ERC20UtilityAgentPromptSchedulerUpdateIterator{contract: _ERC20UtilityAgent.contract, event: "PromptSchedulerUpdate", logs: logs, sub: sub}, nil
}

// WatchPromptSchedulerUpdate is a free log subscription operation binding the contract event 0x667557d852582e84e7de441f650ea0aacbb7de26e3485436e0c27ba8d19a79f1.
//
// Solidity: event PromptSchedulerUpdate(address promptScheduler)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) WatchPromptSchedulerUpdate(opts *bind.WatchOpts, sink chan<- *ERC20UtilityAgentPromptSchedulerUpdate) (event.Subscription, error) {

	logs, sub, err := _ERC20UtilityAgent.contract.WatchLogs(opts, "PromptSchedulerUpdate")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ERC20UtilityAgentPromptSchedulerUpdate)
				if err := _ERC20UtilityAgent.contract.UnpackLog(event, "PromptSchedulerUpdate", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParsePromptSchedulerUpdate is a log parse operation binding the contract event 0x667557d852582e84e7de441f650ea0aacbb7de26e3485436e0c27ba8d19a79f1.
//
// Solidity: event PromptSchedulerUpdate(address promptScheduler)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) ParsePromptSchedulerUpdate(log types.Log) (*ERC20UtilityAgentPromptSchedulerUpdate, error) {
	event := new(ERC20UtilityAgentPromptSchedulerUpdate)
	if err := _ERC20UtilityAgent.contract.UnpackLog(event, "PromptSchedulerUpdate", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// ERC20UtilityAgentSystemPromptUpdateIterator is returned from FilterSystemPromptUpdate and is used to iterate over the raw logs and unpacked data for SystemPromptUpdate events raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentSystemPromptUpdateIterator struct {
	Event *ERC20UtilityAgentSystemPromptUpdate // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ERC20UtilityAgentSystemPromptUpdateIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ERC20UtilityAgentSystemPromptUpdate)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(ERC20UtilityAgentSystemPromptUpdate)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *ERC20UtilityAgentSystemPromptUpdateIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ERC20UtilityAgentSystemPromptUpdateIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ERC20UtilityAgentSystemPromptUpdate represents a SystemPromptUpdate event raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentSystemPromptUpdate struct {
	NewSystemPrompt string
	Raw             types.Log // Blockchain specific contextual infos
}

// FilterSystemPromptUpdate is a free log retrieval operation binding the contract event 0xdf5a31f32f865da404304d8e717e689823eab72d259d756d85fc552ef9ac78d8.
//
// Solidity: event SystemPromptUpdate(string newSystemPrompt)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) FilterSystemPromptUpdate(opts *bind.FilterOpts) (*ERC20UtilityAgentSystemPromptUpdateIterator, error) {

	logs, sub, err := _ERC20UtilityAgent.contract.FilterLogs(opts, "SystemPromptUpdate")
	if err != nil {
		return nil, err
	}
	return &ERC20UtilityAgentSystemPromptUpdateIterator{contract: _ERC20UtilityAgent.contract, event: "SystemPromptUpdate", logs: logs, sub: sub}, nil
}

// WatchSystemPromptUpdate is a free log subscription operation binding the contract event 0xdf5a31f32f865da404304d8e717e689823eab72d259d756d85fc552ef9ac78d8.
//
// Solidity: event SystemPromptUpdate(string newSystemPrompt)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) WatchSystemPromptUpdate(opts *bind.WatchOpts, sink chan<- *ERC20UtilityAgentSystemPromptUpdate) (event.Subscription, error) {

	logs, sub, err := _ERC20UtilityAgent.contract.WatchLogs(opts, "SystemPromptUpdate")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ERC20UtilityAgentSystemPromptUpdate)
				if err := _ERC20UtilityAgent.contract.UnpackLog(event, "SystemPromptUpdate", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseSystemPromptUpdate is a log parse operation binding the contract event 0xdf5a31f32f865da404304d8e717e689823eab72d259d756d85fc552ef9ac78d8.
//
// Solidity: event SystemPromptUpdate(string newSystemPrompt)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) ParseSystemPromptUpdate(log types.Log) (*ERC20UtilityAgentSystemPromptUpdate, error) {
	event := new(ERC20UtilityAgentSystemPromptUpdate)
	if err := _ERC20UtilityAgent.contract.UnpackLog(event, "SystemPromptUpdate", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// ERC20UtilityAgentTransferIterator is returned from FilterTransfer and is used to iterate over the raw logs and unpacked data for Transfer events raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentTransferIterator struct {
	Event *ERC20UtilityAgentTransfer // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ERC20UtilityAgentTransferIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(ERC20UtilityAgentTransfer)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(ERC20UtilityAgentTransfer)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *ERC20UtilityAgentTransferIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ERC20UtilityAgentTransferIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// ERC20UtilityAgentTransfer represents a Transfer event raised by the ERC20UtilityAgent contract.
type ERC20UtilityAgentTransfer struct {
	From  common.Address
	To    common.Address
	Value *big.Int
	Raw   types.Log // Blockchain specific contextual infos
}

// FilterTransfer is a free log retrieval operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 value)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) FilterTransfer(opts *bind.FilterOpts, from []common.Address, to []common.Address) (*ERC20UtilityAgentTransferIterator, error) {

	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}

	logs, sub, err := _ERC20UtilityAgent.contract.FilterLogs(opts, "Transfer", fromRule, toRule)
	if err != nil {
		return nil, err
	}
	return &ERC20UtilityAgentTransferIterator{contract: _ERC20UtilityAgent.contract, event: "Transfer", logs: logs, sub: sub}, nil
}

// WatchTransfer is a free log subscription operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 value)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) WatchTransfer(opts *bind.WatchOpts, sink chan<- *ERC20UtilityAgentTransfer, from []common.Address, to []common.Address) (event.Subscription, error) {

	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}

	logs, sub, err := _ERC20UtilityAgent.contract.WatchLogs(opts, "Transfer", fromRule, toRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(ERC20UtilityAgentTransfer)
				if err := _ERC20UtilityAgent.contract.UnpackLog(event, "Transfer", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseTransfer is a log parse operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 value)
func (_ERC20UtilityAgent *ERC20UtilityAgentFilterer) ParseTransfer(log types.Log) (*ERC20UtilityAgentTransfer, error) {
	event := new(ERC20UtilityAgentTransfer)
	if err := _ERC20UtilityAgent.contract.UnpackLog(event, "Transfer", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
