// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package realworldagentupgradeable

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

// RealWorldAgentUpgradeableMetaData contains all meta data concerning the RealWorldAgentUpgradeable contract.
var RealWorldAgentUpgradeableMetaData = &bind.MetaData{
	ABI: "[{\"type\":\"function\",\"name\":\"act\",\"inputs\":[{\"name\":\"uuid\",\"type\":\"bytes32\",\"internalType\":\"bytes32\"},{\"name\":\"executeData\",\"type\":\"bytes\",\"internalType\":\"bytes\"}],\"outputs\":[{\"name\":\"\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"act\",\"inputs\":[{\"name\":\"uuid\",\"type\":\"bytes32\",\"internalType\":\"bytes32\"},{\"name\":\"data\",\"type\":\"bytes\",\"internalType\":\"bytes\"},{\"name\":\"signature\",\"type\":\"bytes\",\"internalType\":\"bytes\"}],\"outputs\":[{\"name\":\"\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"stateMutability\":\"payable\"},{\"type\":\"function\",\"name\":\"eip712Domain\",\"inputs\":[],\"outputs\":[{\"name\":\"fields\",\"type\":\"bytes1\",\"internalType\":\"bytes1\"},{\"name\":\"name\",\"type\":\"string\",\"internalType\":\"string\"},{\"name\":\"version\",\"type\":\"string\",\"internalType\":\"string\"},{\"name\":\"chainId\",\"type\":\"uint256\",\"internalType\":\"uint256\"},{\"name\":\"verifyingContract\",\"type\":\"address\",\"internalType\":\"address\"},{\"name\":\"salt\",\"type\":\"bytes32\",\"internalType\":\"bytes32\"},{\"name\":\"extensions\",\"type\":\"uint256[]\",\"internalType\":\"uint256[]\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"getHashToSign\",\"inputs\":[{\"name\":\"uuid\",\"type\":\"bytes32\",\"internalType\":\"bytes32\"},{\"name\":\"data\",\"type\":\"bytes\",\"internalType\":\"bytes\"}],\"outputs\":[{\"name\":\"\",\"type\":\"bytes32\",\"internalType\":\"bytes32\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"getPromptId\",\"inputs\":[{\"name\":\"uuid\",\"type\":\"bytes32\",\"internalType\":\"bytes32\"}],\"outputs\":[{\"name\":\"\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"initialize\",\"inputs\":[{\"name\":\"name_\",\"type\":\"string\",\"internalType\":\"string\"},{\"name\":\"version_\",\"type\":\"string\",\"internalType\":\"string\"},{\"name\":\"gateway_\",\"type\":\"address\",\"internalType\":\"contractIHybridGateway\"}],\"outputs\":[],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"owner\",\"inputs\":[],\"outputs\":[{\"name\":\"\",\"type\":\"address\",\"internalType\":\"address\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"renounceOwnership\",\"inputs\":[],\"outputs\":[],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"transferOwnership\",\"inputs\":[{\"name\":\"newOwner\",\"type\":\"address\",\"internalType\":\"address\"}],\"outputs\":[],\"stateMutability\":\"nonpayable\"},{\"type\":\"event\",\"name\":\"EIP712DomainChanged\",\"inputs\":[],\"anonymous\":false},{\"type\":\"event\",\"name\":\"ExecutionRequested\",\"inputs\":[{\"name\":\"actId\",\"type\":\"uint256\",\"indexed\":true,\"internalType\":\"uint256\"},{\"name\":\"uuid\",\"type\":\"bytes32\",\"indexed\":true,\"internalType\":\"bytes32\"},{\"name\":\"creator\",\"type\":\"address\",\"indexed\":true,\"internalType\":\"address\"},{\"name\":\"data\",\"type\":\"bytes\",\"indexed\":false,\"internalType\":\"bytes\"}],\"anonymous\":false},{\"type\":\"event\",\"name\":\"Initialized\",\"inputs\":[{\"name\":\"version\",\"type\":\"uint8\",\"indexed\":false,\"internalType\":\"uint8\"}],\"anonymous\":false},{\"type\":\"event\",\"name\":\"OwnershipTransferred\",\"inputs\":[{\"name\":\"previousOwner\",\"type\":\"address\",\"indexed\":true,\"internalType\":\"address\"},{\"name\":\"newOwner\",\"type\":\"address\",\"indexed\":true,\"internalType\":\"address\"}],\"anonymous\":false},{\"type\":\"event\",\"name\":\"SolutionSubmitted\",\"inputs\":[{\"name\":\"actId\",\"type\":\"uint256\",\"indexed\":true,\"internalType\":\"uint256\"},{\"name\":\"processor\",\"type\":\"address\",\"indexed\":true,\"internalType\":\"address\"},{\"name\":\"result\",\"type\":\"bytes\",\"indexed\":false,\"internalType\":\"bytes\"}],\"anonymous\":false},{\"type\":\"event\",\"name\":\"WorkerUpdated\",\"inputs\":[{\"name\":\"oldWorker\",\"type\":\"address\",\"indexed\":true,\"internalType\":\"address\"},{\"name\":\"newWorker\",\"type\":\"address\",\"indexed\":true,\"internalType\":\"address\"}],\"anonymous\":false},{\"type\":\"error\",\"name\":\"DuplicateUuid\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"InsufficientBalance\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"InvalidAmount\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"InvalidExternalDataLength\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"InvalidRequestStatus\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"InvalidSignature\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"InvalidUuid\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"Timeout\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"Unauthorized\",\"inputs\":[]},{\"type\":\"error\",\"name\":\"ZeroAddress\",\"inputs\":[]}]",
	Bin: "0x608080604052346015576110f1908161001a8239f35b5f80fdfe60806040526004361015610011575f80fd5b5f5f3560e01c8063077f224a146104285780633461813d146103dd578063715018a61461038257806384b0196e146102765780638da5cb5b1461024e578063d19834fc146101c0578063e0839ca114610181578063f2fde38b146100ea5763fea5ef991461007d575f80fd5b60603660031901126100e35760243567ffffffffffffffff81116100e6576100a990369060040161091c565b90916044359067ffffffffffffffff82116100e35760206100db85856100d236600488016108da565b91600435610a78565b604051908152f35b80fd5b5080fd5b50346100e35760203660031901126100e3576004356001600160a01b03811680820361017d57610118610c7c565b156101295761012690610cd4565b80f35b60405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608490fd5b8280fd5b50346100e35760403660031901126100e3576024359067ffffffffffffffff82116100e35760206100db6101b836600486016108da565b60043561094a565b346102275760403660031901126102275760243567ffffffffffffffff8111610227576101f190369060040161091c565b6041811061023f5760401981019181831161022b57818311610227576020926100d26100db936040199084010160413691610894565b5f80fd5b634e487b7160e01b5f52601160045260245ffd5b63099f6dd560e31b5f5260045ffd5b34610227575f366003190112610227576033546040516001600160a01b039091168152602090f35b34610227575f366003190112610227576065541580610378575b1561033b576102df6102a0610d1c565b6102a8610dc0565b60206102ed604051926102bb8385610872565b5f84525f368137604051958695600f60f81b875260e08588015260e08701906108f8565b9085820360408701526108f8565b4660608501523060808501525f60a085015283810360c08501528180845192838152019301915f5b82811061032457505050500390f35b835185528695509381019392810192600101610315565b60405162461bcd60e51b81526020600482015260156024820152741152540dcc4c8e88155b9a5b9a5d1a585b1a5e9959605a1b6044820152606490fd5b5060665415610290565b34610227575f3660031901126102275761039a610c7c565b603380546001600160a01b031981169091555f906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a3005b3461022757602036600319011261022757600435805f52609960205260405f205415610419575f526099602052602060405f2054604051908152f35b6341ba517160e11b5f5260045ffd5b346102275760603660031901126102275760043567ffffffffffffffff8111610227576104599036906004016108da565b60243567ffffffffffffffff8111610227576104799036906004016108da565b6044356001600160a01b03811690819003610227575f549060ff8260081c161591828093610865575b801561084e575b156107f25760ff1981166001175f55826107e1575b506104d860ff5f5460081c166104d381610be4565b610be4565b6104e133610cd4565b6104f160ff5f5460081c16610be4565b835167ffffffffffffffff81116106ec5761050d606754610c44565b601f8111610779575b50602094601f821160011461070b579481929394955f92610700575b50508160011b915f199060031b1c1916176067555b825167ffffffffffffffff81116106ec57610563606854610c44565b601f8111610684575b506020601f821160011461061657819293945f9261060b575b50508160011b915f199060031b1c1916176068555b5f6065555f60665580156105fc576bffffffffffffffffffffffff60a01b609a541617609a556105c657005b61ff00195f54165f557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160018152a1005b63d92e233d60e01b5f5260045ffd5b015190508480610585565b601f1982169060685f525f51602061109c5f395f51905f52915f5b81811061066c57509583600195969710610654575b505050811b0160685561059a565b01515f1960f88460031b161c19169055848080610646565b9192602060018192868b015181550194019201610631565b60685f52601f820160051c5f51602061109c5f395f51905f520190602083106106d7575b601f0160051c5f51602061109c5f395f51905f5201905b8181106106cc575061056c565b5f81556001016106bf565b5f51602061109c5f395f51905f5291506106a8565b634e487b7160e01b5f52604160045260245ffd5b015190508580610532565b601f1982169560675f525f51602061107c5f395f51905f52915f5b88811061076157508360019596979810610749575b505050811b01606755610547565b01515f1960f88460031b161c1916905585808061073b565b91926020600181928685015181550194019201610726565b60675f52601f820160051c5f51602061107c5f395f51905f520190602083106107cc575b601f0160051c5f51602061107c5f395f51905f5201905b8181106107c15750610516565b5f81556001016107b4565b5f51602061107c5f395f51905f52915061079d565b61ffff1916610101175f55846104be565b60405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b1580156104a95750600160ff8216146104a9565b50600160ff8216106104a2565b90601f8019910116810190811067ffffffffffffffff8211176106ec57604052565b92919267ffffffffffffffff82116106ec57604051916108be601f8201601f191660200184610872565b829481845281830111610227578281602093845f960137010152565b9080601f83011215610227578160206108f593359101610894565b90565b805180835260209291819084018484015e5f828201840152601f01601f1916010190565b9181601f840112156102275782359167ffffffffffffffff8311610227576020838186019501011161022757565b604051906040820182811067ffffffffffffffff8211176106ec576042936109c8926109d69260405284526020840190815260405192839160208301957fd4804106ee331eee8e2877cf879bb5c1d679d0ea7cd1f7bf46349111f5fbeb2a8752604080850152516060840152516040608084015260a08301906108f8565b03601f198101835282610872565b5190206109e161100a565b6109e9611055565b6040519060208201927f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8452604083015260608201524660808201523060a082015260a08152610a3a60c082610872565b519020906040519161190160f01b8352600283015260228201522090565b908060209392818452848401375f828201840152601f01601f1916010190565b90929192815f52609960205260405f2054610bd557610abc610ac493835f526099602052600160405f2055610ab7610ab1368886610894565b8561094a565b610e42565b939093610e77565b609a5460408051631b30888b60e31b81526004810191909152949060209086906001600160a01b03168180610afd604482018789610a58565b6001600160a01b039099166024820181905298039134905af1948515610bca575f95610b74575b5084917f9096741026bdd638bcc5cb995f0f00b4574b81f120a23c4a7086347116bf58a191845f5260996020528360405f2055610b6e604051928392602084526020840191610a58565b0390a490565b909194506020813d602011610bc2575b81610b9160209383610872565b81010312610227575193907f9096741026bdd638bcc5cb995f0f00b4574b81f120a23c4a7086347116bf58a1610b24565b3d9150610b84565b6040513d5f823e3d90fd5b63339f7ff560e01b5f5260045ffd5b15610beb57565b60405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608490fd5b90600182811c92168015610c72575b6020831014610c5e57565b634e487b7160e01b5f52602260045260245ffd5b91607f1691610c53565b6033546001600160a01b03163303610c9057565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b603380546001600160a01b039283166001600160a01b0319821681179092559091167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e05f80a3565b604051905f8260675491610d2f83610c44565b8083529260018116908115610da15750600114610d55575b610d5392500383610872565b565b5060675f90815290915f51602061107c5f395f51905f525b818310610d85575050906020610d5392820101610d47565b6020919350806001915483858901015201910190918492610d6d565b60209250610d5394915060ff191682840152151560051b820101610d47565b604051905f8260685491610dd383610c44565b8083529260018116908115610da15750600114610df657610d5392500383610872565b5060685f90815290915f51602061109c5f395f51905f525b818310610e26575050906020610d5392820101610d47565b6020919350806001915483858901015201910190918492610e0e565b9060418151145f14610e6e57610e6a91602082015190606060408401519301515f1a90610f8f565b9091565b50505f90600290565b6005811015610f7b5780610e885750565b60018103610ed55760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606490fd5b60028103610f225760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606490fd5b600314610f2b57565b60405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608490fd5b634e487b7160e01b5f52602160045260245ffd5b7f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08411610fff576020935f9360ff60809460405194855216868401526040830152606082015282805260015afa15610bca575f516001600160a01b03811615610ff757905f90565b505f90600190565b505050505f90600390565b611012610d1c565b8051908115611022576020012090565b505060655480156110305790565b507fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a47090565b61105d610dc0565b805190811561106d576020012090565b50506066548015611030579056fe9787eeb91fe3101235e4a76063c7023ecb40f923f97916639c598592fa30d6aea2153420d844928b4421650203c77babc8b33d7f2e7b450e2966db0c22097753a2646970667358221220c200e62c1943569abdc343d35bcf05f688834d31918a017cb1f7e958482cb24e64736f6c634300081c0033",
}

// RealWorldAgentUpgradeableABI is the input ABI used to generate the binding from.
// Deprecated: Use RealWorldAgentUpgradeableMetaData.ABI instead.
var RealWorldAgentUpgradeableABI = RealWorldAgentUpgradeableMetaData.ABI

// RealWorldAgentUpgradeableBin is the compiled bytecode used for deploying new contracts.
// Deprecated: Use RealWorldAgentUpgradeableMetaData.Bin instead.
var RealWorldAgentUpgradeableBin = RealWorldAgentUpgradeableMetaData.Bin

// DeployRealWorldAgentUpgradeable deploys a new Ethereum contract, binding an instance of RealWorldAgentUpgradeable to it.
func DeployRealWorldAgentUpgradeable(auth *bind.TransactOpts, backend bind.ContractBackend) (common.Address, *types.Transaction, *RealWorldAgentUpgradeable, error) {
	parsed, err := RealWorldAgentUpgradeableMetaData.GetAbi()
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	if parsed == nil {
		return common.Address{}, nil, nil, errors.New("GetABI returned nil")
	}

	address, tx, contract, err := bind.DeployContract(auth, *parsed, common.FromHex(RealWorldAgentUpgradeableBin), backend)
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	return address, tx, &RealWorldAgentUpgradeable{RealWorldAgentUpgradeableCaller: RealWorldAgentUpgradeableCaller{contract: contract}, RealWorldAgentUpgradeableTransactor: RealWorldAgentUpgradeableTransactor{contract: contract}, RealWorldAgentUpgradeableFilterer: RealWorldAgentUpgradeableFilterer{contract: contract}}, nil
}

// RealWorldAgentUpgradeable is an auto generated Go binding around an Ethereum contract.
type RealWorldAgentUpgradeable struct {
	RealWorldAgentUpgradeableCaller     // Read-only binding to the contract
	RealWorldAgentUpgradeableTransactor // Write-only binding to the contract
	RealWorldAgentUpgradeableFilterer   // Log filterer for contract events
}

// RealWorldAgentUpgradeableCaller is an auto generated read-only Go binding around an Ethereum contract.
type RealWorldAgentUpgradeableCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// RealWorldAgentUpgradeableTransactor is an auto generated write-only Go binding around an Ethereum contract.
type RealWorldAgentUpgradeableTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// RealWorldAgentUpgradeableFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type RealWorldAgentUpgradeableFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// RealWorldAgentUpgradeableSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type RealWorldAgentUpgradeableSession struct {
	Contract     *RealWorldAgentUpgradeable // Generic contract binding to set the session for
	CallOpts     bind.CallOpts              // Call options to use throughout this session
	TransactOpts bind.TransactOpts          // Transaction auth options to use throughout this session
}

// RealWorldAgentUpgradeableCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type RealWorldAgentUpgradeableCallerSession struct {
	Contract *RealWorldAgentUpgradeableCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts                    // Call options to use throughout this session
}

// RealWorldAgentUpgradeableTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type RealWorldAgentUpgradeableTransactorSession struct {
	Contract     *RealWorldAgentUpgradeableTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts                    // Transaction auth options to use throughout this session
}

// RealWorldAgentUpgradeableRaw is an auto generated low-level Go binding around an Ethereum contract.
type RealWorldAgentUpgradeableRaw struct {
	Contract *RealWorldAgentUpgradeable // Generic contract binding to access the raw methods on
}

// RealWorldAgentUpgradeableCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type RealWorldAgentUpgradeableCallerRaw struct {
	Contract *RealWorldAgentUpgradeableCaller // Generic read-only contract binding to access the raw methods on
}

// RealWorldAgentUpgradeableTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type RealWorldAgentUpgradeableTransactorRaw struct {
	Contract *RealWorldAgentUpgradeableTransactor // Generic write-only contract binding to access the raw methods on
}

// NewRealWorldAgentUpgradeable creates a new instance of RealWorldAgentUpgradeable, bound to a specific deployed contract.
func NewRealWorldAgentUpgradeable(address common.Address, backend bind.ContractBackend) (*RealWorldAgentUpgradeable, error) {
	contract, err := bindRealWorldAgentUpgradeable(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &RealWorldAgentUpgradeable{RealWorldAgentUpgradeableCaller: RealWorldAgentUpgradeableCaller{contract: contract}, RealWorldAgentUpgradeableTransactor: RealWorldAgentUpgradeableTransactor{contract: contract}, RealWorldAgentUpgradeableFilterer: RealWorldAgentUpgradeableFilterer{contract: contract}}, nil
}

// NewRealWorldAgentUpgradeableCaller creates a new read-only instance of RealWorldAgentUpgradeable, bound to a specific deployed contract.
func NewRealWorldAgentUpgradeableCaller(address common.Address, caller bind.ContractCaller) (*RealWorldAgentUpgradeableCaller, error) {
	contract, err := bindRealWorldAgentUpgradeable(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &RealWorldAgentUpgradeableCaller{contract: contract}, nil
}

// NewRealWorldAgentUpgradeableTransactor creates a new write-only instance of RealWorldAgentUpgradeable, bound to a specific deployed contract.
func NewRealWorldAgentUpgradeableTransactor(address common.Address, transactor bind.ContractTransactor) (*RealWorldAgentUpgradeableTransactor, error) {
	contract, err := bindRealWorldAgentUpgradeable(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &RealWorldAgentUpgradeableTransactor{contract: contract}, nil
}

// NewRealWorldAgentUpgradeableFilterer creates a new log filterer instance of RealWorldAgentUpgradeable, bound to a specific deployed contract.
func NewRealWorldAgentUpgradeableFilterer(address common.Address, filterer bind.ContractFilterer) (*RealWorldAgentUpgradeableFilterer, error) {
	contract, err := bindRealWorldAgentUpgradeable(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &RealWorldAgentUpgradeableFilterer{contract: contract}, nil
}

// bindRealWorldAgentUpgradeable binds a generic wrapper to an already deployed contract.
func bindRealWorldAgentUpgradeable(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := RealWorldAgentUpgradeableMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _RealWorldAgentUpgradeable.Contract.RealWorldAgentUpgradeableCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _RealWorldAgentUpgradeable.Contract.RealWorldAgentUpgradeableTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _RealWorldAgentUpgradeable.Contract.RealWorldAgentUpgradeableTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _RealWorldAgentUpgradeable.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _RealWorldAgentUpgradeable.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _RealWorldAgentUpgradeable.Contract.contract.Transact(opts, method, params...)
}

// Eip712Domain is a free data retrieval call binding the contract method 0x84b0196e.
//
// Solidity: function eip712Domain() view returns(bytes1 fields, string name, string version, uint256 chainId, address verifyingContract, bytes32 salt, uint256[] extensions)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableCaller) Eip712Domain(opts *bind.CallOpts) (struct {
	Fields            [1]byte
	Name              string
	Version           string
	ChainId           *big.Int
	VerifyingContract common.Address
	Salt              [32]byte
	Extensions        []*big.Int
}, error) {
	var out []interface{}
	err := _RealWorldAgentUpgradeable.contract.Call(opts, &out, "eip712Domain")

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
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableSession) Eip712Domain() (struct {
	Fields            [1]byte
	Name              string
	Version           string
	ChainId           *big.Int
	VerifyingContract common.Address
	Salt              [32]byte
	Extensions        []*big.Int
}, error) {
	return _RealWorldAgentUpgradeable.Contract.Eip712Domain(&_RealWorldAgentUpgradeable.CallOpts)
}

// Eip712Domain is a free data retrieval call binding the contract method 0x84b0196e.
//
// Solidity: function eip712Domain() view returns(bytes1 fields, string name, string version, uint256 chainId, address verifyingContract, bytes32 salt, uint256[] extensions)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableCallerSession) Eip712Domain() (struct {
	Fields            [1]byte
	Name              string
	Version           string
	ChainId           *big.Int
	VerifyingContract common.Address
	Salt              [32]byte
	Extensions        []*big.Int
}, error) {
	return _RealWorldAgentUpgradeable.Contract.Eip712Domain(&_RealWorldAgentUpgradeable.CallOpts)
}

// GetHashToSign is a free data retrieval call binding the contract method 0xe0839ca1.
//
// Solidity: function getHashToSign(bytes32 uuid, bytes data) view returns(bytes32)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableCaller) GetHashToSign(opts *bind.CallOpts, uuid [32]byte, data []byte) ([32]byte, error) {
	var out []interface{}
	err := _RealWorldAgentUpgradeable.contract.Call(opts, &out, "getHashToSign", uuid, data)

	if err != nil {
		return *new([32]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)

	return out0, err

}

// GetHashToSign is a free data retrieval call binding the contract method 0xe0839ca1.
//
// Solidity: function getHashToSign(bytes32 uuid, bytes data) view returns(bytes32)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableSession) GetHashToSign(uuid [32]byte, data []byte) ([32]byte, error) {
	return _RealWorldAgentUpgradeable.Contract.GetHashToSign(&_RealWorldAgentUpgradeable.CallOpts, uuid, data)
}

// GetHashToSign is a free data retrieval call binding the contract method 0xe0839ca1.
//
// Solidity: function getHashToSign(bytes32 uuid, bytes data) view returns(bytes32)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableCallerSession) GetHashToSign(uuid [32]byte, data []byte) ([32]byte, error) {
	return _RealWorldAgentUpgradeable.Contract.GetHashToSign(&_RealWorldAgentUpgradeable.CallOpts, uuid, data)
}

// GetPromptId is a free data retrieval call binding the contract method 0x3461813d.
//
// Solidity: function getPromptId(bytes32 uuid) view returns(uint256)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableCaller) GetPromptId(opts *bind.CallOpts, uuid [32]byte) (*big.Int, error) {
	var out []interface{}
	err := _RealWorldAgentUpgradeable.contract.Call(opts, &out, "getPromptId", uuid)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetPromptId is a free data retrieval call binding the contract method 0x3461813d.
//
// Solidity: function getPromptId(bytes32 uuid) view returns(uint256)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableSession) GetPromptId(uuid [32]byte) (*big.Int, error) {
	return _RealWorldAgentUpgradeable.Contract.GetPromptId(&_RealWorldAgentUpgradeable.CallOpts, uuid)
}

// GetPromptId is a free data retrieval call binding the contract method 0x3461813d.
//
// Solidity: function getPromptId(bytes32 uuid) view returns(uint256)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableCallerSession) GetPromptId(uuid [32]byte) (*big.Int, error) {
	return _RealWorldAgentUpgradeable.Contract.GetPromptId(&_RealWorldAgentUpgradeable.CallOpts, uuid)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _RealWorldAgentUpgradeable.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableSession) Owner() (common.Address, error) {
	return _RealWorldAgentUpgradeable.Contract.Owner(&_RealWorldAgentUpgradeable.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableCallerSession) Owner() (common.Address, error) {
	return _RealWorldAgentUpgradeable.Contract.Owner(&_RealWorldAgentUpgradeable.CallOpts)
}

// Act is a paid mutator transaction binding the contract method 0xd19834fc.
//
// Solidity: function act(bytes32 uuid, bytes executeData) returns(uint256)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableTransactor) Act(opts *bind.TransactOpts, uuid [32]byte, executeData []byte) (*types.Transaction, error) {
	return _RealWorldAgentUpgradeable.contract.Transact(opts, "act", uuid, executeData)
}

// Act is a paid mutator transaction binding the contract method 0xd19834fc.
//
// Solidity: function act(bytes32 uuid, bytes executeData) returns(uint256)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableSession) Act(uuid [32]byte, executeData []byte) (*types.Transaction, error) {
	return _RealWorldAgentUpgradeable.Contract.Act(&_RealWorldAgentUpgradeable.TransactOpts, uuid, executeData)
}

// Act is a paid mutator transaction binding the contract method 0xd19834fc.
//
// Solidity: function act(bytes32 uuid, bytes executeData) returns(uint256)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableTransactorSession) Act(uuid [32]byte, executeData []byte) (*types.Transaction, error) {
	return _RealWorldAgentUpgradeable.Contract.Act(&_RealWorldAgentUpgradeable.TransactOpts, uuid, executeData)
}

// Act0 is a paid mutator transaction binding the contract method 0xfea5ef99.
//
// Solidity: function act(bytes32 uuid, bytes data, bytes signature) payable returns(uint256)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableTransactor) Act0(opts *bind.TransactOpts, uuid [32]byte, data []byte, signature []byte) (*types.Transaction, error) {
	return _RealWorldAgentUpgradeable.contract.Transact(opts, "act0", uuid, data, signature)
}

// Act0 is a paid mutator transaction binding the contract method 0xfea5ef99.
//
// Solidity: function act(bytes32 uuid, bytes data, bytes signature) payable returns(uint256)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableSession) Act0(uuid [32]byte, data []byte, signature []byte) (*types.Transaction, error) {
	return _RealWorldAgentUpgradeable.Contract.Act0(&_RealWorldAgentUpgradeable.TransactOpts, uuid, data, signature)
}

// Act0 is a paid mutator transaction binding the contract method 0xfea5ef99.
//
// Solidity: function act(bytes32 uuid, bytes data, bytes signature) payable returns(uint256)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableTransactorSession) Act0(uuid [32]byte, data []byte, signature []byte) (*types.Transaction, error) {
	return _RealWorldAgentUpgradeable.Contract.Act0(&_RealWorldAgentUpgradeable.TransactOpts, uuid, data, signature)
}

// Initialize is a paid mutator transaction binding the contract method 0x077f224a.
//
// Solidity: function initialize(string name_, string version_, address gateway_) returns()
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableTransactor) Initialize(opts *bind.TransactOpts, name_ string, version_ string, gateway_ common.Address) (*types.Transaction, error) {
	return _RealWorldAgentUpgradeable.contract.Transact(opts, "initialize", name_, version_, gateway_)
}

// Initialize is a paid mutator transaction binding the contract method 0x077f224a.
//
// Solidity: function initialize(string name_, string version_, address gateway_) returns()
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableSession) Initialize(name_ string, version_ string, gateway_ common.Address) (*types.Transaction, error) {
	return _RealWorldAgentUpgradeable.Contract.Initialize(&_RealWorldAgentUpgradeable.TransactOpts, name_, version_, gateway_)
}

// Initialize is a paid mutator transaction binding the contract method 0x077f224a.
//
// Solidity: function initialize(string name_, string version_, address gateway_) returns()
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableTransactorSession) Initialize(name_ string, version_ string, gateway_ common.Address) (*types.Transaction, error) {
	return _RealWorldAgentUpgradeable.Contract.Initialize(&_RealWorldAgentUpgradeable.TransactOpts, name_, version_, gateway_)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _RealWorldAgentUpgradeable.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableSession) RenounceOwnership() (*types.Transaction, error) {
	return _RealWorldAgentUpgradeable.Contract.RenounceOwnership(&_RealWorldAgentUpgradeable.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _RealWorldAgentUpgradeable.Contract.RenounceOwnership(&_RealWorldAgentUpgradeable.TransactOpts)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _RealWorldAgentUpgradeable.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _RealWorldAgentUpgradeable.Contract.TransferOwnership(&_RealWorldAgentUpgradeable.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _RealWorldAgentUpgradeable.Contract.TransferOwnership(&_RealWorldAgentUpgradeable.TransactOpts, newOwner)
}

// RealWorldAgentUpgradeableEIP712DomainChangedIterator is returned from FilterEIP712DomainChanged and is used to iterate over the raw logs and unpacked data for EIP712DomainChanged events raised by the RealWorldAgentUpgradeable contract.
type RealWorldAgentUpgradeableEIP712DomainChangedIterator struct {
	Event *RealWorldAgentUpgradeableEIP712DomainChanged // Event containing the contract specifics and raw log

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
func (it *RealWorldAgentUpgradeableEIP712DomainChangedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RealWorldAgentUpgradeableEIP712DomainChanged)
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
		it.Event = new(RealWorldAgentUpgradeableEIP712DomainChanged)
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
func (it *RealWorldAgentUpgradeableEIP712DomainChangedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RealWorldAgentUpgradeableEIP712DomainChangedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RealWorldAgentUpgradeableEIP712DomainChanged represents a EIP712DomainChanged event raised by the RealWorldAgentUpgradeable contract.
type RealWorldAgentUpgradeableEIP712DomainChanged struct {
	Raw types.Log // Blockchain specific contextual infos
}

// FilterEIP712DomainChanged is a free log retrieval operation binding the contract event 0x0a6387c9ea3628b88a633bb4f3b151770f70085117a15f9bf3787cda53f13d31.
//
// Solidity: event EIP712DomainChanged()
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableFilterer) FilterEIP712DomainChanged(opts *bind.FilterOpts) (*RealWorldAgentUpgradeableEIP712DomainChangedIterator, error) {

	logs, sub, err := _RealWorldAgentUpgradeable.contract.FilterLogs(opts, "EIP712DomainChanged")
	if err != nil {
		return nil, err
	}
	return &RealWorldAgentUpgradeableEIP712DomainChangedIterator{contract: _RealWorldAgentUpgradeable.contract, event: "EIP712DomainChanged", logs: logs, sub: sub}, nil
}

// WatchEIP712DomainChanged is a free log subscription operation binding the contract event 0x0a6387c9ea3628b88a633bb4f3b151770f70085117a15f9bf3787cda53f13d31.
//
// Solidity: event EIP712DomainChanged()
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableFilterer) WatchEIP712DomainChanged(opts *bind.WatchOpts, sink chan<- *RealWorldAgentUpgradeableEIP712DomainChanged) (event.Subscription, error) {

	logs, sub, err := _RealWorldAgentUpgradeable.contract.WatchLogs(opts, "EIP712DomainChanged")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RealWorldAgentUpgradeableEIP712DomainChanged)
				if err := _RealWorldAgentUpgradeable.contract.UnpackLog(event, "EIP712DomainChanged", log); err != nil {
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
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableFilterer) ParseEIP712DomainChanged(log types.Log) (*RealWorldAgentUpgradeableEIP712DomainChanged, error) {
	event := new(RealWorldAgentUpgradeableEIP712DomainChanged)
	if err := _RealWorldAgentUpgradeable.contract.UnpackLog(event, "EIP712DomainChanged", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RealWorldAgentUpgradeableExecutionRequestedIterator is returned from FilterExecutionRequested and is used to iterate over the raw logs and unpacked data for ExecutionRequested events raised by the RealWorldAgentUpgradeable contract.
type RealWorldAgentUpgradeableExecutionRequestedIterator struct {
	Event *RealWorldAgentUpgradeableExecutionRequested // Event containing the contract specifics and raw log

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
func (it *RealWorldAgentUpgradeableExecutionRequestedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RealWorldAgentUpgradeableExecutionRequested)
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
		it.Event = new(RealWorldAgentUpgradeableExecutionRequested)
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
func (it *RealWorldAgentUpgradeableExecutionRequestedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RealWorldAgentUpgradeableExecutionRequestedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RealWorldAgentUpgradeableExecutionRequested represents a ExecutionRequested event raised by the RealWorldAgentUpgradeable contract.
type RealWorldAgentUpgradeableExecutionRequested struct {
	ActId   *big.Int
	Uuid    [32]byte
	Creator common.Address
	Data    []byte
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterExecutionRequested is a free log retrieval operation binding the contract event 0x9096741026bdd638bcc5cb995f0f00b4574b81f120a23c4a7086347116bf58a1.
//
// Solidity: event ExecutionRequested(uint256 indexed actId, bytes32 indexed uuid, address indexed creator, bytes data)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableFilterer) FilterExecutionRequested(opts *bind.FilterOpts, actId []*big.Int, uuid [][32]byte, creator []common.Address) (*RealWorldAgentUpgradeableExecutionRequestedIterator, error) {

	var actIdRule []interface{}
	for _, actIdItem := range actId {
		actIdRule = append(actIdRule, actIdItem)
	}
	var uuidRule []interface{}
	for _, uuidItem := range uuid {
		uuidRule = append(uuidRule, uuidItem)
	}
	var creatorRule []interface{}
	for _, creatorItem := range creator {
		creatorRule = append(creatorRule, creatorItem)
	}

	logs, sub, err := _RealWorldAgentUpgradeable.contract.FilterLogs(opts, "ExecutionRequested", actIdRule, uuidRule, creatorRule)
	if err != nil {
		return nil, err
	}
	return &RealWorldAgentUpgradeableExecutionRequestedIterator{contract: _RealWorldAgentUpgradeable.contract, event: "ExecutionRequested", logs: logs, sub: sub}, nil
}

// WatchExecutionRequested is a free log subscription operation binding the contract event 0x9096741026bdd638bcc5cb995f0f00b4574b81f120a23c4a7086347116bf58a1.
//
// Solidity: event ExecutionRequested(uint256 indexed actId, bytes32 indexed uuid, address indexed creator, bytes data)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableFilterer) WatchExecutionRequested(opts *bind.WatchOpts, sink chan<- *RealWorldAgentUpgradeableExecutionRequested, actId []*big.Int, uuid [][32]byte, creator []common.Address) (event.Subscription, error) {

	var actIdRule []interface{}
	for _, actIdItem := range actId {
		actIdRule = append(actIdRule, actIdItem)
	}
	var uuidRule []interface{}
	for _, uuidItem := range uuid {
		uuidRule = append(uuidRule, uuidItem)
	}
	var creatorRule []interface{}
	for _, creatorItem := range creator {
		creatorRule = append(creatorRule, creatorItem)
	}

	logs, sub, err := _RealWorldAgentUpgradeable.contract.WatchLogs(opts, "ExecutionRequested", actIdRule, uuidRule, creatorRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RealWorldAgentUpgradeableExecutionRequested)
				if err := _RealWorldAgentUpgradeable.contract.UnpackLog(event, "ExecutionRequested", log); err != nil {
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

// ParseExecutionRequested is a log parse operation binding the contract event 0x9096741026bdd638bcc5cb995f0f00b4574b81f120a23c4a7086347116bf58a1.
//
// Solidity: event ExecutionRequested(uint256 indexed actId, bytes32 indexed uuid, address indexed creator, bytes data)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableFilterer) ParseExecutionRequested(log types.Log) (*RealWorldAgentUpgradeableExecutionRequested, error) {
	event := new(RealWorldAgentUpgradeableExecutionRequested)
	if err := _RealWorldAgentUpgradeable.contract.UnpackLog(event, "ExecutionRequested", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RealWorldAgentUpgradeableInitializedIterator is returned from FilterInitialized and is used to iterate over the raw logs and unpacked data for Initialized events raised by the RealWorldAgentUpgradeable contract.
type RealWorldAgentUpgradeableInitializedIterator struct {
	Event *RealWorldAgentUpgradeableInitialized // Event containing the contract specifics and raw log

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
func (it *RealWorldAgentUpgradeableInitializedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RealWorldAgentUpgradeableInitialized)
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
		it.Event = new(RealWorldAgentUpgradeableInitialized)
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
func (it *RealWorldAgentUpgradeableInitializedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RealWorldAgentUpgradeableInitializedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RealWorldAgentUpgradeableInitialized represents a Initialized event raised by the RealWorldAgentUpgradeable contract.
type RealWorldAgentUpgradeableInitialized struct {
	Version uint8
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterInitialized is a free log retrieval operation binding the contract event 0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498.
//
// Solidity: event Initialized(uint8 version)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableFilterer) FilterInitialized(opts *bind.FilterOpts) (*RealWorldAgentUpgradeableInitializedIterator, error) {

	logs, sub, err := _RealWorldAgentUpgradeable.contract.FilterLogs(opts, "Initialized")
	if err != nil {
		return nil, err
	}
	return &RealWorldAgentUpgradeableInitializedIterator{contract: _RealWorldAgentUpgradeable.contract, event: "Initialized", logs: logs, sub: sub}, nil
}

// WatchInitialized is a free log subscription operation binding the contract event 0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498.
//
// Solidity: event Initialized(uint8 version)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableFilterer) WatchInitialized(opts *bind.WatchOpts, sink chan<- *RealWorldAgentUpgradeableInitialized) (event.Subscription, error) {

	logs, sub, err := _RealWorldAgentUpgradeable.contract.WatchLogs(opts, "Initialized")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RealWorldAgentUpgradeableInitialized)
				if err := _RealWorldAgentUpgradeable.contract.UnpackLog(event, "Initialized", log); err != nil {
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

// ParseInitialized is a log parse operation binding the contract event 0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498.
//
// Solidity: event Initialized(uint8 version)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableFilterer) ParseInitialized(log types.Log) (*RealWorldAgentUpgradeableInitialized, error) {
	event := new(RealWorldAgentUpgradeableInitialized)
	if err := _RealWorldAgentUpgradeable.contract.UnpackLog(event, "Initialized", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RealWorldAgentUpgradeableOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the RealWorldAgentUpgradeable contract.
type RealWorldAgentUpgradeableOwnershipTransferredIterator struct {
	Event *RealWorldAgentUpgradeableOwnershipTransferred // Event containing the contract specifics and raw log

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
func (it *RealWorldAgentUpgradeableOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RealWorldAgentUpgradeableOwnershipTransferred)
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
		it.Event = new(RealWorldAgentUpgradeableOwnershipTransferred)
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
func (it *RealWorldAgentUpgradeableOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RealWorldAgentUpgradeableOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RealWorldAgentUpgradeableOwnershipTransferred represents a OwnershipTransferred event raised by the RealWorldAgentUpgradeable contract.
type RealWorldAgentUpgradeableOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*RealWorldAgentUpgradeableOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _RealWorldAgentUpgradeable.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &RealWorldAgentUpgradeableOwnershipTransferredIterator{contract: _RealWorldAgentUpgradeable.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *RealWorldAgentUpgradeableOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _RealWorldAgentUpgradeable.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RealWorldAgentUpgradeableOwnershipTransferred)
				if err := _RealWorldAgentUpgradeable.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
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
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableFilterer) ParseOwnershipTransferred(log types.Log) (*RealWorldAgentUpgradeableOwnershipTransferred, error) {
	event := new(RealWorldAgentUpgradeableOwnershipTransferred)
	if err := _RealWorldAgentUpgradeable.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RealWorldAgentUpgradeableSolutionSubmittedIterator is returned from FilterSolutionSubmitted and is used to iterate over the raw logs and unpacked data for SolutionSubmitted events raised by the RealWorldAgentUpgradeable contract.
type RealWorldAgentUpgradeableSolutionSubmittedIterator struct {
	Event *RealWorldAgentUpgradeableSolutionSubmitted // Event containing the contract specifics and raw log

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
func (it *RealWorldAgentUpgradeableSolutionSubmittedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RealWorldAgentUpgradeableSolutionSubmitted)
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
		it.Event = new(RealWorldAgentUpgradeableSolutionSubmitted)
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
func (it *RealWorldAgentUpgradeableSolutionSubmittedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RealWorldAgentUpgradeableSolutionSubmittedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RealWorldAgentUpgradeableSolutionSubmitted represents a SolutionSubmitted event raised by the RealWorldAgentUpgradeable contract.
type RealWorldAgentUpgradeableSolutionSubmitted struct {
	ActId     *big.Int
	Processor common.Address
	Result    []byte
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterSolutionSubmitted is a free log retrieval operation binding the contract event 0x847d58c674038bb7f3ec4f6bbd97d64a3da0f3db4312900c67a2778f0b2840ba.
//
// Solidity: event SolutionSubmitted(uint256 indexed actId, address indexed processor, bytes result)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableFilterer) FilterSolutionSubmitted(opts *bind.FilterOpts, actId []*big.Int, processor []common.Address) (*RealWorldAgentUpgradeableSolutionSubmittedIterator, error) {

	var actIdRule []interface{}
	for _, actIdItem := range actId {
		actIdRule = append(actIdRule, actIdItem)
	}
	var processorRule []interface{}
	for _, processorItem := range processor {
		processorRule = append(processorRule, processorItem)
	}

	logs, sub, err := _RealWorldAgentUpgradeable.contract.FilterLogs(opts, "SolutionSubmitted", actIdRule, processorRule)
	if err != nil {
		return nil, err
	}
	return &RealWorldAgentUpgradeableSolutionSubmittedIterator{contract: _RealWorldAgentUpgradeable.contract, event: "SolutionSubmitted", logs: logs, sub: sub}, nil
}

// WatchSolutionSubmitted is a free log subscription operation binding the contract event 0x847d58c674038bb7f3ec4f6bbd97d64a3da0f3db4312900c67a2778f0b2840ba.
//
// Solidity: event SolutionSubmitted(uint256 indexed actId, address indexed processor, bytes result)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableFilterer) WatchSolutionSubmitted(opts *bind.WatchOpts, sink chan<- *RealWorldAgentUpgradeableSolutionSubmitted, actId []*big.Int, processor []common.Address) (event.Subscription, error) {

	var actIdRule []interface{}
	for _, actIdItem := range actId {
		actIdRule = append(actIdRule, actIdItem)
	}
	var processorRule []interface{}
	for _, processorItem := range processor {
		processorRule = append(processorRule, processorItem)
	}

	logs, sub, err := _RealWorldAgentUpgradeable.contract.WatchLogs(opts, "SolutionSubmitted", actIdRule, processorRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RealWorldAgentUpgradeableSolutionSubmitted)
				if err := _RealWorldAgentUpgradeable.contract.UnpackLog(event, "SolutionSubmitted", log); err != nil {
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

// ParseSolutionSubmitted is a log parse operation binding the contract event 0x847d58c674038bb7f3ec4f6bbd97d64a3da0f3db4312900c67a2778f0b2840ba.
//
// Solidity: event SolutionSubmitted(uint256 indexed actId, address indexed processor, bytes result)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableFilterer) ParseSolutionSubmitted(log types.Log) (*RealWorldAgentUpgradeableSolutionSubmitted, error) {
	event := new(RealWorldAgentUpgradeableSolutionSubmitted)
	if err := _RealWorldAgentUpgradeable.contract.UnpackLog(event, "SolutionSubmitted", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RealWorldAgentUpgradeableWorkerUpdatedIterator is returned from FilterWorkerUpdated and is used to iterate over the raw logs and unpacked data for WorkerUpdated events raised by the RealWorldAgentUpgradeable contract.
type RealWorldAgentUpgradeableWorkerUpdatedIterator struct {
	Event *RealWorldAgentUpgradeableWorkerUpdated // Event containing the contract specifics and raw log

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
func (it *RealWorldAgentUpgradeableWorkerUpdatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RealWorldAgentUpgradeableWorkerUpdated)
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
		it.Event = new(RealWorldAgentUpgradeableWorkerUpdated)
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
func (it *RealWorldAgentUpgradeableWorkerUpdatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RealWorldAgentUpgradeableWorkerUpdatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RealWorldAgentUpgradeableWorkerUpdated represents a WorkerUpdated event raised by the RealWorldAgentUpgradeable contract.
type RealWorldAgentUpgradeableWorkerUpdated struct {
	OldWorker common.Address
	NewWorker common.Address
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterWorkerUpdated is a free log retrieval operation binding the contract event 0x98b88aa89cb5f247008e613dc8529d633ab05a62f7120c07ebcfcdd852fc2a8d.
//
// Solidity: event WorkerUpdated(address indexed oldWorker, address indexed newWorker)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableFilterer) FilterWorkerUpdated(opts *bind.FilterOpts, oldWorker []common.Address, newWorker []common.Address) (*RealWorldAgentUpgradeableWorkerUpdatedIterator, error) {

	var oldWorkerRule []interface{}
	for _, oldWorkerItem := range oldWorker {
		oldWorkerRule = append(oldWorkerRule, oldWorkerItem)
	}
	var newWorkerRule []interface{}
	for _, newWorkerItem := range newWorker {
		newWorkerRule = append(newWorkerRule, newWorkerItem)
	}

	logs, sub, err := _RealWorldAgentUpgradeable.contract.FilterLogs(opts, "WorkerUpdated", oldWorkerRule, newWorkerRule)
	if err != nil {
		return nil, err
	}
	return &RealWorldAgentUpgradeableWorkerUpdatedIterator{contract: _RealWorldAgentUpgradeable.contract, event: "WorkerUpdated", logs: logs, sub: sub}, nil
}

// WatchWorkerUpdated is a free log subscription operation binding the contract event 0x98b88aa89cb5f247008e613dc8529d633ab05a62f7120c07ebcfcdd852fc2a8d.
//
// Solidity: event WorkerUpdated(address indexed oldWorker, address indexed newWorker)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableFilterer) WatchWorkerUpdated(opts *bind.WatchOpts, sink chan<- *RealWorldAgentUpgradeableWorkerUpdated, oldWorker []common.Address, newWorker []common.Address) (event.Subscription, error) {

	var oldWorkerRule []interface{}
	for _, oldWorkerItem := range oldWorker {
		oldWorkerRule = append(oldWorkerRule, oldWorkerItem)
	}
	var newWorkerRule []interface{}
	for _, newWorkerItem := range newWorker {
		newWorkerRule = append(newWorkerRule, newWorkerItem)
	}

	logs, sub, err := _RealWorldAgentUpgradeable.contract.WatchLogs(opts, "WorkerUpdated", oldWorkerRule, newWorkerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RealWorldAgentUpgradeableWorkerUpdated)
				if err := _RealWorldAgentUpgradeable.contract.UnpackLog(event, "WorkerUpdated", log); err != nil {
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

// ParseWorkerUpdated is a log parse operation binding the contract event 0x98b88aa89cb5f247008e613dc8529d633ab05a62f7120c07ebcfcdd852fc2a8d.
//
// Solidity: event WorkerUpdated(address indexed oldWorker, address indexed newWorker)
func (_RealWorldAgentUpgradeable *RealWorldAgentUpgradeableFilterer) ParseWorkerUpdated(log types.Log) (*RealWorldAgentUpgradeableWorkerUpdated, error) {
	event := new(RealWorldAgentUpgradeableWorkerUpdated)
	if err := _RealWorldAgentUpgradeable.contract.UnpackLog(event, "WorkerUpdated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
