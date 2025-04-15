// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package agentfactory

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

// AgentFactoryMetaData contains all meta data concerning the AgentFactory contract.
var AgentFactoryMetaData = &bind.MetaData{
	ABI: "[{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"agentId\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"agent\",\"type\":\"address\"}],\"name\":\"AgentCreated\",\"type\":\"event\"}]",
}

// AgentFactoryABI is the input ABI used to generate the binding from.
// Deprecated: Use AgentFactoryMetaData.ABI instead.
var AgentFactoryABI = AgentFactoryMetaData.ABI

// AgentFactory is an auto generated Go binding around an Ethereum contract.
type AgentFactory struct {
	AgentFactoryCaller     // Read-only binding to the contract
	AgentFactoryTransactor // Write-only binding to the contract
	AgentFactoryFilterer   // Log filterer for contract events
}

// AgentFactoryCaller is an auto generated read-only Go binding around an Ethereum contract.
type AgentFactoryCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AgentFactoryTransactor is an auto generated write-only Go binding around an Ethereum contract.
type AgentFactoryTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AgentFactoryFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type AgentFactoryFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AgentFactorySession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type AgentFactorySession struct {
	Contract     *AgentFactory     // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// AgentFactoryCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type AgentFactoryCallerSession struct {
	Contract *AgentFactoryCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts       // Call options to use throughout this session
}

// AgentFactoryTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type AgentFactoryTransactorSession struct {
	Contract     *AgentFactoryTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts       // Transaction auth options to use throughout this session
}

// AgentFactoryRaw is an auto generated low-level Go binding around an Ethereum contract.
type AgentFactoryRaw struct {
	Contract *AgentFactory // Generic contract binding to access the raw methods on
}

// AgentFactoryCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type AgentFactoryCallerRaw struct {
	Contract *AgentFactoryCaller // Generic read-only contract binding to access the raw methods on
}

// AgentFactoryTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type AgentFactoryTransactorRaw struct {
	Contract *AgentFactoryTransactor // Generic write-only contract binding to access the raw methods on
}

// NewAgentFactory creates a new instance of AgentFactory, bound to a specific deployed contract.
func NewAgentFactory(address common.Address, backend bind.ContractBackend) (*AgentFactory, error) {
	contract, err := bindAgentFactory(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &AgentFactory{AgentFactoryCaller: AgentFactoryCaller{contract: contract}, AgentFactoryTransactor: AgentFactoryTransactor{contract: contract}, AgentFactoryFilterer: AgentFactoryFilterer{contract: contract}}, nil
}

// NewAgentFactoryCaller creates a new read-only instance of AgentFactory, bound to a specific deployed contract.
func NewAgentFactoryCaller(address common.Address, caller bind.ContractCaller) (*AgentFactoryCaller, error) {
	contract, err := bindAgentFactory(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &AgentFactoryCaller{contract: contract}, nil
}

// NewAgentFactoryTransactor creates a new write-only instance of AgentFactory, bound to a specific deployed contract.
func NewAgentFactoryTransactor(address common.Address, transactor bind.ContractTransactor) (*AgentFactoryTransactor, error) {
	contract, err := bindAgentFactory(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &AgentFactoryTransactor{contract: contract}, nil
}

// NewAgentFactoryFilterer creates a new log filterer instance of AgentFactory, bound to a specific deployed contract.
func NewAgentFactoryFilterer(address common.Address, filterer bind.ContractFilterer) (*AgentFactoryFilterer, error) {
	contract, err := bindAgentFactory(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &AgentFactoryFilterer{contract: contract}, nil
}

// bindAgentFactory binds a generic wrapper to an already deployed contract.
func bindAgentFactory(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := AgentFactoryMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_AgentFactory *AgentFactoryRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _AgentFactory.Contract.AgentFactoryCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_AgentFactory *AgentFactoryRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AgentFactory.Contract.AgentFactoryTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_AgentFactory *AgentFactoryRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _AgentFactory.Contract.AgentFactoryTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_AgentFactory *AgentFactoryCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _AgentFactory.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_AgentFactory *AgentFactoryTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AgentFactory.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_AgentFactory *AgentFactoryTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _AgentFactory.Contract.contract.Transact(opts, method, params...)
}

// AgentFactoryAgentCreatedIterator is returned from FilterAgentCreated and is used to iterate over the raw logs and unpacked data for AgentCreated events raised by the AgentFactory contract.
type AgentFactoryAgentCreatedIterator struct {
	Event *AgentFactoryAgentCreated // Event containing the contract specifics and raw log

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
func (it *AgentFactoryAgentCreatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AgentFactoryAgentCreated)
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
		it.Event = new(AgentFactoryAgentCreated)
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
func (it *AgentFactoryAgentCreatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AgentFactoryAgentCreatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AgentFactoryAgentCreated represents a AgentCreated event raised by the AgentFactory contract.
type AgentFactoryAgentCreated struct {
	AgentId [32]byte
	Agent   common.Address
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterAgentCreated is a free log retrieval operation binding the contract event 0x7c96960a1ebd8cc753b10836ea25bd7c9c4f8cd43590db1e8b3648cb0ec4cc89.
//
// Solidity: event AgentCreated(bytes32 indexed agentId, address indexed agent)
func (_AgentFactory *AgentFactoryFilterer) FilterAgentCreated(opts *bind.FilterOpts, agentId [][32]byte, agent []common.Address) (*AgentFactoryAgentCreatedIterator, error) {

	var agentIdRule []interface{}
	for _, agentIdItem := range agentId {
		agentIdRule = append(agentIdRule, agentIdItem)
	}
	var agentRule []interface{}
	for _, agentItem := range agent {
		agentRule = append(agentRule, agentItem)
	}

	logs, sub, err := _AgentFactory.contract.FilterLogs(opts, "AgentCreated", agentIdRule, agentRule)
	if err != nil {
		return nil, err
	}
	return &AgentFactoryAgentCreatedIterator{contract: _AgentFactory.contract, event: "AgentCreated", logs: logs, sub: sub}, nil
}

// WatchAgentCreated is a free log subscription operation binding the contract event 0x7c96960a1ebd8cc753b10836ea25bd7c9c4f8cd43590db1e8b3648cb0ec4cc89.
//
// Solidity: event AgentCreated(bytes32 indexed agentId, address indexed agent)
func (_AgentFactory *AgentFactoryFilterer) WatchAgentCreated(opts *bind.WatchOpts, sink chan<- *AgentFactoryAgentCreated, agentId [][32]byte, agent []common.Address) (event.Subscription, error) {

	var agentIdRule []interface{}
	for _, agentIdItem := range agentId {
		agentIdRule = append(agentIdRule, agentIdItem)
	}
	var agentRule []interface{}
	for _, agentItem := range agent {
		agentRule = append(agentRule, agentItem)
	}

	logs, sub, err := _AgentFactory.contract.WatchLogs(opts, "AgentCreated", agentIdRule, agentRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AgentFactoryAgentCreated)
				if err := _AgentFactory.contract.UnpackLog(event, "AgentCreated", log); err != nil {
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

// ParseAgentCreated is a log parse operation binding the contract event 0x7c96960a1ebd8cc753b10836ea25bd7c9c4f8cd43590db1e8b3648cb0ec4cc89.
//
// Solidity: event AgentCreated(bytes32 indexed agentId, address indexed agent)
func (_AgentFactory *AgentFactoryFilterer) ParseAgentCreated(log types.Log) (*AgentFactoryAgentCreated, error) {
	event := new(AgentFactoryAgentCreated)
	if err := _AgentFactory.contract.UnpackLog(event, "AgentCreated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
