// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package agentupgradeable

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

// IAgentCodePointer is an auto generated low-level Go binding around an user-defined struct.
type IAgentCodePointer struct {
	RetrieveAddress common.Address
	FileType        uint8
	FileName        string
}

// AgentUpgradeableMetaData contains all meta data concerning the AgentUpgradeable contract.
var AgentUpgradeableMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[],\"name\":\"DigestAlreadyUsed\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"InvalidData\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"InvalidVersion\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"Unauthenticated\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"ZeroAddress\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"version\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"pIndex\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"retrieveAddress\",\"type\":\"address\"},{\"internalType\":\"enumIAgent.FileType\",\"name\":\"fileType\",\"type\":\"uint8\"},{\"internalType\":\"string\",\"name\":\"fileName\",\"type\":\"string\"}],\"indexed\":false,\"internalType\":\"structIAgent.CodePointer\",\"name\":\"newPointer\",\"type\":\"tuple\"}],\"name\":\"CodePointerCreated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[],\"name\":\"EIP712DomainChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint8\",\"name\":\"version\",\"type\":\"uint8\"}],\"name\":\"Initialized\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"eip712Domain\",\"outputs\":[{\"internalType\":\"bytes1\",\"name\":\"fields\",\"type\":\"bytes1\"},{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"version\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"chainId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"verifyingContract\",\"type\":\"address\"},{\"internalType\":\"bytes32\",\"name\":\"salt\",\"type\":\"bytes32\"},{\"internalType\":\"uint256[]\",\"name\":\"extensions\",\"type\":\"uint256[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"version\",\"type\":\"uint16\"}],\"name\":\"getAgentCode\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"code\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getCodeLanguage\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getCurrentVersion\",\"outputs\":[{\"internalType\":\"uint16\",\"name\":\"\",\"type\":\"uint16\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"version\",\"type\":\"uint16\"}],\"name\":\"getDepsAgents\",\"outputs\":[{\"internalType\":\"address[]\",\"name\":\"\",\"type\":\"address[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"address\",\"name\":\"retrieveAddress\",\"type\":\"address\"},{\"internalType\":\"enumIAgent.FileType\",\"name\":\"fileType\",\"type\":\"uint8\"},{\"internalType\":\"string\",\"name\":\"fileName\",\"type\":\"string\"}],\"internalType\":\"structIAgent.CodePointer[]\",\"name\":\"pointers\",\"type\":\"tuple[]\"},{\"internalType\":\"address[]\",\"name\":\"depsAgents\",\"type\":\"address[]\"},{\"internalType\":\"bool\",\"name\":\"isOnchain\",\"type\":\"bool\"}],\"name\":\"getHashToSign\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"agentName\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"agentVersion\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"codeLanguage\",\"type\":\"string\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"retrieveAddress\",\"type\":\"address\"},{\"internalType\":\"enumIAgent.FileType\",\"name\":\"fileType\",\"type\":\"uint8\"},{\"internalType\":\"string\",\"name\":\"fileName\",\"type\":\"string\"}],\"internalType\":\"structIAgent.CodePointer[]\",\"name\":\"pointers\",\"type\":\"tuple[]\"},{\"internalType\":\"address[]\",\"name\":\"depsAgents\",\"type\":\"address[]\"},{\"internalType\":\"address\",\"name\":\"agentOwner\",\"type\":\"address\"},{\"internalType\":\"bool\",\"name\":\"isOnchain\",\"type\":\"bool\"}],\"name\":\"initialize\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"version\",\"type\":\"uint256\"}],\"name\":\"isOnchain\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"address\",\"name\":\"retrieveAddress\",\"type\":\"address\"},{\"internalType\":\"enumIAgent.FileType\",\"name\":\"fileType\",\"type\":\"uint8\"},{\"internalType\":\"string\",\"name\":\"fileName\",\"type\":\"string\"}],\"internalType\":\"structIAgent.CodePointer[]\",\"name\":\"pointers\",\"type\":\"tuple[]\"},{\"internalType\":\"address[]\",\"name\":\"depsAgents\",\"type\":\"address[]\"},{\"internalType\":\"bool\",\"name\":\"isOnchain\",\"type\":\"bool\"}],\"name\":\"publishAgentCode\",\"outputs\":[{\"internalType\":\"uint16\",\"name\":\"\",\"type\":\"uint16\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"address\",\"name\":\"retrieveAddress\",\"type\":\"address\"},{\"internalType\":\"enumIAgent.FileType\",\"name\":\"fileType\",\"type\":\"uint8\"},{\"internalType\":\"string\",\"name\":\"fileName\",\"type\":\"string\"}],\"internalType\":\"structIAgent.CodePointer[]\",\"name\":\"pointers\",\"type\":\"tuple[]\"},{\"internalType\":\"address[]\",\"name\":\"depsAgents\",\"type\":\"address[]\"},{\"internalType\":\"bool\",\"name\":\"isOnchain\",\"type\":\"bool\"},{\"internalType\":\"bytes\",\"name\":\"signature\",\"type\":\"bytes\"}],\"name\":\"publishAgentCodeWithSignature\",\"outputs\":[{\"internalType\":\"uint16\",\"name\":\"\",\"type\":\"uint16\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
	Bin: "0x6080806040523461001657612c35908161001c8239f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c806323b01cfa146100e757806345a836ec146100e25780636681792d146100dd5780637109e143146100d8578063715018a6146100d357806384b0196e146100ce5780638da5cb5b146100c95780639de79e65146100c4578063b095e56a146100bf578063c1f3dd3c146100ba578063f2fde38b146100b5578063fa0d4179146100b05763fabec44a146100ab57600080fd5b610cdc565b610c45565b610b07565b6109fe565b61099f565b610929565b610861565b610787565b610637565b610568565b6102d1565b61018a565b346101365760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261013657600435600052609c602052602060ff604060002054166040519015158152f35b600080fd5b9181601f840112156101365782359167ffffffffffffffff8311610136576020808501948460051b01011161013657565b60443590811515820361013657565b60c43590811515820361013657565b346101365760807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101365767ffffffffffffffff600435818111610136576101da90369060040161013b565b91602435818111610136576101f390369060040161013b565b6101fe93919361016c565b906064359484861161013657366023870112156101365785600401359485116101365736602486880101116101365761025396602461023e970194610d1c565b60405161ffff90911681529081906020820190565b0390f35b60005b83811061026a5750506000910152565b818101518382015260200161025a565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f6020936102b681518092818752878088019101610257565b0116010190565b9060206102ce92818152019061027a565b90565b34610136576000807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103ef5760405190806099549061031382610df3565b808552916020916001918281169081156103a4575060011461034c575b610253866103408188038261047a565b604051918291826102bd565b9350609984527f72a152ddfb8e864297c917af52ea6c1c68aead0fee1a62673fcc7e0c94979d005b838510610391575050505081016020016103408261025338610330565b8054868601840152938201938101610374565b879650610253979450602093506103409592507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0091501682840152151560051b820101929338610330565b80fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6060810190811067ffffffffffffffff82111761043d57604052565b6103f2565b6040810190811067ffffffffffffffff82111761043d57604052565b6020810190811067ffffffffffffffff82111761043d57604052565b90601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0910116810190811067ffffffffffffffff82111761043d57604052565b92919267ffffffffffffffff821161043d576040519161050360207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f840116018461047a565b829481845281830111610136578281602093846000960137010152565b9080601f83011215610136578160206102ce933591016104bb565b73ffffffffffffffffffffffffffffffffffffffff81160361013657565b60a435906105668261053b565b565b346101365760e07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261013657600467ffffffffffffffff8135818111610136576105b89036908401610520565b90602435818111610136576105d09036908501610520565b90604435818111610136576105e89036908601610520565b606435828111610136576105ff903690870161013b565b9092608435908111610136576106359661061b9136910161013b565b939092610626610559565b9561062f61017b565b97610fc8565b005b34610136576000807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126103ef5761066f611fc8565b8073ffffffffffffffffffffffffffffffffffffffff6067547fffffffffffffffffffffffff00000000000000000000000000000000000000008116606755167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b919361073a73ffffffffffffffffffffffffffffffffffffffff92957f0f00000000000000000000000000000000000000000000000000000000000000855261072c60209760e0602088015260e087019061027a565b90858203604087015261027a565b936060840152166080820152600060a082015260c08183039101526020808451928381520193019160005b828110610773575050505090565b835185529381019392810192600101610765565b346101365760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610136576001541580610857575b156107f9576107cd610e46565b6107d5610f29565b906102536040516107e58161045e565b6000815260405193849330914691866106d6565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601560248201527f4549503731323a20556e696e697469616c697a656400000000000000000000006044820152fd5b50600254156107c0565b346101365760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261013657602073ffffffffffffffffffffffffffffffffffffffff60675416604051908152f35b60607ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc8201126101365767ffffffffffffffff9160043583811161013657826108fe9160040161013b565b93909392602435918211610136576109189160040161013b565b909160443580151581036101365790565b3461013657610937366108b3565b9173ffffffffffffffffffffffffffffffffffffffff609a9594955460101c1633036109755760209461096994611dc9565b61ffff60405191168152f35b60046040517fc8759c17000000000000000000000000000000000000000000000000000000008152fd5b346101365760206109bb6109b2366108b3565b93929092611a74565b604051908152f35b7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc60209101126101365760043561ffff811681036101365790565b3461013657610a0c366109c3565b610a158161215f565b61ffff8116600052602090609d60205260406000205490610a34611c30565b91610a3d611c30565b936000925b828410610a565761025361034087876123ae565b90919293610a8d610a8886610a798561ffff16600052609e602052604060002090565b90600052602052604060002090565b611c43565b9083610a98836122d8565b92018051610aa58161191a565b610aae8161191a565b610aca5750600191610abf916123ae565b945b01929190610a42565b6001909692919651610adb8161191a565b610ae48161191a565b14610af3575b50600190610ac1565b610b0090600192976123ae565b9590610aea565b346101365760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261013657600435610b428161053b565b610b4a611fc8565b73ffffffffffffffffffffffffffffffffffffffff811615610b6f5761063590612047565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152fd5b602090602060408183019282815285518094520193019160005b828110610c1b575050505090565b835173ffffffffffffffffffffffffffffffffffffffff1685529381019392810192600101610c0d565b346101365761ffff610c56366109c3565b610c5f8161215f565b166000526020609f6020526040600020906040519081602084549182815201936000526020600020916000905b828210610caf5761025385610ca38189038261047a565b60405191829182610bf3565b835473ffffffffffffffffffffffffffffffffffffffff1686529485019460019384019390910190610c8c565b346101365760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261013657602061ffff609a5416604051908152f35b909192939495610d2f8686868686611a74565b9687600052609b60205260ff60406000205416610dc957610d58610d5e91610d669336916104bb565b886123ec565b91909161242e565b73ffffffffffffffffffffffffffffffffffffffff80609a5460101c16911603610975576102ce95600052609b602052604060002060017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00825416179055611dc9565b60046040517f0ca85bce000000000000000000000000000000000000000000000000000000008152fd5b90600182811c92168015610e3c575b6020831014610e0d57565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b91607f1691610e02565b6040519060008260035491610e5a83610df3565b80835292602090600190818116908115610ee65750600114610e85575b50506105669250038361047a565b91509260036000527fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b936000925b828410610ece57506105669450505081016020013880610e77565b85548885018301529485019487945092810192610eb3565b9050602093506105669592507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0091501682840152151560051b8201013880610e77565b6040519060008260045491610f3d83610df3565b80835292602090600190818116908115610ee65750600114610f675750506105669250038361047a565b91509260046000527f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b936000925b828410610fb057506105669450505081016020013880610e77565b85548885018301529485019487945092810192610f95565b96949290979593916000549860ff8a60081c1615809a819b61116c575b811561114c575b50156110c857611030988a61102760017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff006000541617600055565b611092576115ae565b61103657565b6110637fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff60005416600055565b604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb384740249890602090a1565b6110c36101007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff6000541617600055565b6115ae565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a65640000000000000000000000000000000000006064820152fd5b303b1591508161115e575b5038610fec565b6001915060ff161438611157565b600160ff8216109150610fe5565b601f8111611186575050565b60009060036000527fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b906020601f850160051c830194106111e2575b601f0160051c01915b8281106111d757505050565b8181556001016111cb565b90925082906111c2565b601f81116111f8575050565b60009060046000527f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b906020601f850160051c83019410611254575b601f0160051c01915b82811061124957505050565b81815560010161123d565b9092508290611234565b601f811161126a575050565b60009060996000527f72a152ddfb8e864297c917af52ea6c1c68aead0fee1a62673fcc7e0c94979d00906020601f850160051c830194106112c6575b601f0160051c01915b8281106112bb57505050565b8181556001016112af565b90925082906112a6565b90601f81116112de57505050565b6000916000526020600020906020601f850160051c8301941061131c575b601f0160051c01915b82811061131157505050565b818155600101611305565b90925082906112fc565b90815167ffffffffffffffff811161043d5761134c81611347600454610df3565b6111ec565b602080601f83116001146113ac5750819061139c93946000926113a1575b50507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8260011b9260031b1c19161790565b600455565b01519050388061136a565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08316946113fd60046000527f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b90565b926000905b878210611458575050836001959610611421575b505050811b01600455565b01517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60f88460031b161c19169055388080611416565b80600185968294968601518155019501930190611402565b90815167ffffffffffffffff811161043d5761149681611491609954610df3565b61125e565b602080601f83116001146114ea575081906114e593946000926113a15750507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8260011b9260031b1c19161790565b609955565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe083169461153b60996000527f72a152ddfb8e864297c917af52ea6c1c68aead0fee1a62673fcc7e0c94979d0090565b926000905b87821061159657505083600195961061155f575b505050811b01609955565b01517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60f88460031b161c19169055388080611554565b80600185968294968601518155019501930190611540565b989796919873ffffffffffffffffffffffffffffffffffffffff8316156117d2576115e960ff60005460081c166115e481611f3d565b611f3d565b6115f233612047565b61160760ff60005460081c166115e481611f3d565b80519067ffffffffffffffff821161043d5761162d82611628600354610df3565b61117a565b602090816001601f8511146116fe57506116f6949361168d846116ae956116fb9e9f95611695956000926113a15750507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8260011b9260031b1c19161790565b600355611326565b61169f6000600155565b6116a96000600255565b611470565b7fffffffffffffffffffff0000000000000000000000000000000000000000ffff75ffffffffffffffffffffffffffffffffffffffff0000609a549260101b16911617609a55565b611dc9565b50565b600360005291907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe084167fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b936000905b8282106117ba575050846116fb9d9e94611695946116f69998946116ae9860019510611783575b505050811b01600355611326565b01517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60f88460031b161c19169055388080611775565b8060018697829497870151815501960194019061174e565b60046040517fd92e233d000000000000000000000000000000000000000000000000000000008152fd5b67ffffffffffffffff811161043d5760051b60200190565b9061181e826117fc565b61182b604051918261047a565b8281527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe061185982946117fc565b0190602036910137565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b91908110156118d25760051b810135907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa181360301821215610136570190565b611863565b356102ce8161053b565b6002111561013657565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b6002111561192457565b6118eb565b356102ce816118e1565b9035907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe181360301821215610136570180359067ffffffffffffffff82116101365760200191813603831361013657565b9060028210156119245752565b6119e660609295949373ffffffffffffffffffffffffffffffffffffffff60808401977ef64cadd167df3afa1ea4fb7888efb37899c764460df114896aebb63773c21b85521660208401526040830190611984565b0152565b80518210156118d25760209160051b010190565b805160208092019160005b828110611a17575050505090565b835185529381019392810192600101611a09565b9060005b818110611a3c5750505090565b90919260019073ffffffffffffffffffffffffffffffffffffffff8535611a628161053b565b16815260209081019401929101611a2f565b949391929094611a8386611814565b9560005b818110611b84575050506102ce9394611b7c91611afb611b076040519384611ab36020820180936119fe565b0394611ae57fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe09687810183528261047a565b5190209660405192839160208301958691611a2b565b0384810183528261047a565b519020611b70611b1a609a5461ffff1690565b604051958693602085019889929361ffff91959460809360a08601977fd80f90efed24555c1a53feb69d3d2a4aaa7df60d1f486ccb7cf044a204a0c5ac8752602087015260408601521515606085015216910152565b0390810183528261047a565b5190206120b4565b80611b9a611b956001938587611892565b6118d7565b6020611c1c611bb482611bae86898b611892565b01611929565b91611bf0611bc386898b611892565b611bdc611bd560409283810190611933565b36916104bb565b838151910120905194859384019687611991565b037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0810183528261047a565b519020611c29828b6119ea565b5201611a87565b60405190611c3d8261045e565b60008252565b9060405191611c5183610421565b8260ff825473ffffffffffffffffffffffffffffffffffffffff8116835260a01c169160209260028110156119245783830152600180910190604051938492600092815491611c9f83610df3565b8087529260018116908115611d0f5750600114611cca575b50505050604092916119e691038461047a565b60009081528381209695945091905b818310611cf7575093945091925090820101816119e6604038611cb7565b86548884018501529586019587945091830191611cd9565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001685880152505050151560051b8301019050816119e6604038611cb7565b91908110156118d25760051b0190565b80546801000000000000000081101561043d57600181018083558110156118d25773ffffffffffffffffffffffffffffffffffffffff9160005260206000200191167fffffffffffffffffffffffff0000000000000000000000000000000000000000825416179055565b909291928015611f1357611e27611dde6125e6565b95611df78761ffff16600052609c602052604060002090565b9060ff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0083541691151516179055565b60005b818110611eab5750505060005b818110611e445750505090565b611e6e611e55611b95838587611d4e565b73ffffffffffffffffffffffffffffffffffffffff1690565b156117d257600190611ea5611e918661ffff16600052609f602052604060002090565b611e9f611b95848789611d4e565b90611d5e565b01611e37565b611eb6818385611892565b611ec560409182810190611933565b905015611eea575080611ee4611ede6001938587611892565b88612739565b01611e2a565b600490517f5cb045db000000000000000000000000000000000000000000000000000000008152fd5b60046040517f5cb045db000000000000000000000000000000000000000000000000000000008152fd5b15611f4457565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e670000000000000000000000000000000000000000006064820152fd5b73ffffffffffffffffffffffffffffffffffffffff606754163303611fe957565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b6067549073ffffffffffffffffffffffffffffffffffffffff80911691827fffffffffffffffffffffffff0000000000000000000000000000000000000000821617606755167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3565b6120bc612b8e565b6120c4612bd9565b916040519260208401927f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f8452604085015260608401524660808401523060a084015260a0835260c083019183831067ffffffffffffffff84111761043d5760429360e29184604052815190207f1901000000000000000000000000000000000000000000000000000000000000855260c282015201522090565b61ffff80609a541691161161217057565b60046040517fa9146eeb000000000000000000000000000000000000000000000000000000008152fd5b604051906121a782610442565b600482527f69706673000000000000000000000000000000000000000000000000000000006020830152565b519063ffffffff8216820361013657565b6020808284031261013657815167ffffffffffffffff9283821161013657019260409283858303126101365783519461221c86610442565b8051865283810151918211610136570181601f8201121561013657805191612243836117fc565b946122508151968761047a565b8386528486019185606080960285010193818511610136578601925b84841061227f5750505050505082015290565b858483031261013657868691845161229681610421565b86516122a18161053b565b81526122ae8388016121d3565b838201526122bd8688016121d3565b8682015281520193019261226c565b6040513d6000823e3d90fd5b6122e1816129d5565b602081519101206122f061219a565b6020815191012014600014612306576040015190565b6000816040612332611e55611e5561236a965173ffffffffffffffffffffffffffffffffffffffff1690565b9101519060405180809581947fe0876aa8000000000000000000000000000000000000000000000000000000008352600483016102bd565b03915afa80156123a9576102ce91600091612386575b50612a31565b6123a391503d806000833e61239b818361047a565b8101906121e4565b38612380565b6122cc565b60206102ce9160405193816123cc8693518092868087019101610257565b82016123e082518093868085019101610257565b0103808452018261047a565b90604181511460001461241a57612416916020820151906060604084015193015160001a90612aff565b9091565b5050600090600290565b6005111561192457565b61243781612424565b8061243f5750565b61244881612424565b600181036124af576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606490fd5b6124b881612424565b6002810361251f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606490fd5b8061252b600392612424565b1461253257565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c60448201527f75650000000000000000000000000000000000000000000000000000000000006064820152608490fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b609a5461ffff908181168281146126285760017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00009101928316911617609a5590565b6125b7565b906020825273ffffffffffffffffffffffffffffffffffffffff81356126528161053b565b1660208301526126736020820135612669816118e1565b6040840190611984565b60408101357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe1823603018112156101365701906020823592019167ffffffffffffffff811161013657803603831361013657601f817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe09260a0956060808701528160808701528686013760008582860101520116010190565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146126285760010190565b91909161ffff81166000908082526020609d8152604083205492609e825260408120848252825260408120916127b488356127738161053b565b849073ffffffffffffffffffffffffffffffffffffffff167fffffffffffffffffffffffff0000000000000000000000000000000000000000825416179055565b808801356127c1816118e1565b6002811015611924577fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff74ff000000000000000000000000000000000000000085549260a01b16911617835560018093019261282060408a018a611933565b93909167ffffffffffffffff851161043d57612846856128408854610df3565b886112d0565b8193601f86116001146128fd575050836128cd946128e49a9b947f0c69de805f518c322126e1fa81f2e91d814412a2ad304638fcaed200bd7f43dc97946128be94926128f25750507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8260011b9260031b1c19161790565b90555b6040519182918261262d565b0390a361ffff16600052609d602052604060002090565b6128ee815461270c565b9055565b01359050388061136a565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe086959395169161293488600052602060002090565b95915b8383106129be57505050936128e4999a937f0c69de805f518c322126e1fa81f2e91d814412a2ad304638fcaed200bd7f43dc9693600193836128cd9810612986575b505050811b0190556128c1565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60f88560031b161c19910135169055388080612979565b858501358755958601959381019391810191612937565b5173ffffffffffffffffffffffffffffffffffffffff166129f8576102ce61219a565b604051612a0481610442565b600281527f6673000000000000000000000000000000000000000000000000000000000000602082015290565b906020809201518051906020916040805195600080945b848610612a8757505050505050601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe091828101855201168201604052565b909192939495838760051b8301015180518686830151920151813b808211612ac8575082849392600195938e930394859301903c0196019493929190612a48565b9260849387937f86d14d89000000000000000000000000000000000000000000000000000000008552600452602452604452606452fd5b9291907f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311612b825791608094939160ff602094604051948552168484015260408301526060820152600093849182805260015afa156123a957815173ffffffffffffffffffffffffffffffffffffffff811615612b7c579190565b50600190565b50505050600090600390565b612b96610e46565b8051908115612ba6576020012090565b50506001548015612bb45790565b507fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a47090565b612be1610f29565b8051908115612bf1576020012090565b50506002548015612bb4579056fea2646970667358221220e276007e34097b0dcd6631c50b1c38a41366433bca33e74e7cc57a62c33dd13d64736f6c63430008160033",
}

// AgentUpgradeableABI is the input ABI used to generate the binding from.
// Deprecated: Use AgentUpgradeableMetaData.ABI instead.
var AgentUpgradeableABI = AgentUpgradeableMetaData.ABI

// AgentUpgradeableBin is the compiled bytecode used for deploying new contracts.
// Deprecated: Use AgentUpgradeableMetaData.Bin instead.
var AgentUpgradeableBin = AgentUpgradeableMetaData.Bin

// DeployAgentUpgradeable deploys a new Ethereum contract, binding an instance of AgentUpgradeable to it.
func DeployAgentUpgradeable(auth *bind.TransactOpts, backend bind.ContractBackend) (common.Address, *types.Transaction, *AgentUpgradeable, error) {
	parsed, err := AgentUpgradeableMetaData.GetAbi()
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	if parsed == nil {
		return common.Address{}, nil, nil, errors.New("GetABI returned nil")
	}

	address, tx, contract, err := bind.DeployContract(auth, *parsed, common.FromHex(AgentUpgradeableBin), backend)
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	return address, tx, &AgentUpgradeable{AgentUpgradeableCaller: AgentUpgradeableCaller{contract: contract}, AgentUpgradeableTransactor: AgentUpgradeableTransactor{contract: contract}, AgentUpgradeableFilterer: AgentUpgradeableFilterer{contract: contract}}, nil
}

// AgentUpgradeable is an auto generated Go binding around an Ethereum contract.
type AgentUpgradeable struct {
	AgentUpgradeableCaller     // Read-only binding to the contract
	AgentUpgradeableTransactor // Write-only binding to the contract
	AgentUpgradeableFilterer   // Log filterer for contract events
}

// AgentUpgradeableCaller is an auto generated read-only Go binding around an Ethereum contract.
type AgentUpgradeableCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AgentUpgradeableTransactor is an auto generated write-only Go binding around an Ethereum contract.
type AgentUpgradeableTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AgentUpgradeableFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type AgentUpgradeableFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AgentUpgradeableSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type AgentUpgradeableSession struct {
	Contract     *AgentUpgradeable // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// AgentUpgradeableCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type AgentUpgradeableCallerSession struct {
	Contract *AgentUpgradeableCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts           // Call options to use throughout this session
}

// AgentUpgradeableTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type AgentUpgradeableTransactorSession struct {
	Contract     *AgentUpgradeableTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts           // Transaction auth options to use throughout this session
}

// AgentUpgradeableRaw is an auto generated low-level Go binding around an Ethereum contract.
type AgentUpgradeableRaw struct {
	Contract *AgentUpgradeable // Generic contract binding to access the raw methods on
}

// AgentUpgradeableCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type AgentUpgradeableCallerRaw struct {
	Contract *AgentUpgradeableCaller // Generic read-only contract binding to access the raw methods on
}

// AgentUpgradeableTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type AgentUpgradeableTransactorRaw struct {
	Contract *AgentUpgradeableTransactor // Generic write-only contract binding to access the raw methods on
}

// NewAgentUpgradeable creates a new instance of AgentUpgradeable, bound to a specific deployed contract.
func NewAgentUpgradeable(address common.Address, backend bind.ContractBackend) (*AgentUpgradeable, error) {
	contract, err := bindAgentUpgradeable(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &AgentUpgradeable{AgentUpgradeableCaller: AgentUpgradeableCaller{contract: contract}, AgentUpgradeableTransactor: AgentUpgradeableTransactor{contract: contract}, AgentUpgradeableFilterer: AgentUpgradeableFilterer{contract: contract}}, nil
}

// NewAgentUpgradeableCaller creates a new read-only instance of AgentUpgradeable, bound to a specific deployed contract.
func NewAgentUpgradeableCaller(address common.Address, caller bind.ContractCaller) (*AgentUpgradeableCaller, error) {
	contract, err := bindAgentUpgradeable(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &AgentUpgradeableCaller{contract: contract}, nil
}

// NewAgentUpgradeableTransactor creates a new write-only instance of AgentUpgradeable, bound to a specific deployed contract.
func NewAgentUpgradeableTransactor(address common.Address, transactor bind.ContractTransactor) (*AgentUpgradeableTransactor, error) {
	contract, err := bindAgentUpgradeable(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &AgentUpgradeableTransactor{contract: contract}, nil
}

// NewAgentUpgradeableFilterer creates a new log filterer instance of AgentUpgradeable, bound to a specific deployed contract.
func NewAgentUpgradeableFilterer(address common.Address, filterer bind.ContractFilterer) (*AgentUpgradeableFilterer, error) {
	contract, err := bindAgentUpgradeable(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &AgentUpgradeableFilterer{contract: contract}, nil
}

// bindAgentUpgradeable binds a generic wrapper to an already deployed contract.
func bindAgentUpgradeable(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := AgentUpgradeableMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_AgentUpgradeable *AgentUpgradeableRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _AgentUpgradeable.Contract.AgentUpgradeableCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_AgentUpgradeable *AgentUpgradeableRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AgentUpgradeable.Contract.AgentUpgradeableTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_AgentUpgradeable *AgentUpgradeableRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _AgentUpgradeable.Contract.AgentUpgradeableTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_AgentUpgradeable *AgentUpgradeableCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _AgentUpgradeable.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_AgentUpgradeable *AgentUpgradeableTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AgentUpgradeable.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_AgentUpgradeable *AgentUpgradeableTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _AgentUpgradeable.Contract.contract.Transact(opts, method, params...)
}

// Eip712Domain is a free data retrieval call binding the contract method 0x84b0196e.
//
// Solidity: function eip712Domain() view returns(bytes1 fields, string name, string version, uint256 chainId, address verifyingContract, bytes32 salt, uint256[] extensions)
func (_AgentUpgradeable *AgentUpgradeableCaller) Eip712Domain(opts *bind.CallOpts) (struct {
	Fields            [1]byte
	Name              string
	Version           string
	ChainId           *big.Int
	VerifyingContract common.Address
	Salt              [32]byte
	Extensions        []*big.Int
}, error) {
	var out []interface{}
	err := _AgentUpgradeable.contract.Call(opts, &out, "eip712Domain")

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
func (_AgentUpgradeable *AgentUpgradeableSession) Eip712Domain() (struct {
	Fields            [1]byte
	Name              string
	Version           string
	ChainId           *big.Int
	VerifyingContract common.Address
	Salt              [32]byte
	Extensions        []*big.Int
}, error) {
	return _AgentUpgradeable.Contract.Eip712Domain(&_AgentUpgradeable.CallOpts)
}

// Eip712Domain is a free data retrieval call binding the contract method 0x84b0196e.
//
// Solidity: function eip712Domain() view returns(bytes1 fields, string name, string version, uint256 chainId, address verifyingContract, bytes32 salt, uint256[] extensions)
func (_AgentUpgradeable *AgentUpgradeableCallerSession) Eip712Domain() (struct {
	Fields            [1]byte
	Name              string
	Version           string
	ChainId           *big.Int
	VerifyingContract common.Address
	Salt              [32]byte
	Extensions        []*big.Int
}, error) {
	return _AgentUpgradeable.Contract.Eip712Domain(&_AgentUpgradeable.CallOpts)
}

// GetAgentCode is a free data retrieval call binding the contract method 0xc1f3dd3c.
//
// Solidity: function getAgentCode(uint16 version) view returns(string code)
func (_AgentUpgradeable *AgentUpgradeableCaller) GetAgentCode(opts *bind.CallOpts, version uint16) (string, error) {
	var out []interface{}
	err := _AgentUpgradeable.contract.Call(opts, &out, "getAgentCode", version)

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// GetAgentCode is a free data retrieval call binding the contract method 0xc1f3dd3c.
//
// Solidity: function getAgentCode(uint16 version) view returns(string code)
func (_AgentUpgradeable *AgentUpgradeableSession) GetAgentCode(version uint16) (string, error) {
	return _AgentUpgradeable.Contract.GetAgentCode(&_AgentUpgradeable.CallOpts, version)
}

// GetAgentCode is a free data retrieval call binding the contract method 0xc1f3dd3c.
//
// Solidity: function getAgentCode(uint16 version) view returns(string code)
func (_AgentUpgradeable *AgentUpgradeableCallerSession) GetAgentCode(version uint16) (string, error) {
	return _AgentUpgradeable.Contract.GetAgentCode(&_AgentUpgradeable.CallOpts, version)
}

// GetCodeLanguage is a free data retrieval call binding the contract method 0x6681792d.
//
// Solidity: function getCodeLanguage() view returns(string)
func (_AgentUpgradeable *AgentUpgradeableCaller) GetCodeLanguage(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _AgentUpgradeable.contract.Call(opts, &out, "getCodeLanguage")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// GetCodeLanguage is a free data retrieval call binding the contract method 0x6681792d.
//
// Solidity: function getCodeLanguage() view returns(string)
func (_AgentUpgradeable *AgentUpgradeableSession) GetCodeLanguage() (string, error) {
	return _AgentUpgradeable.Contract.GetCodeLanguage(&_AgentUpgradeable.CallOpts)
}

// GetCodeLanguage is a free data retrieval call binding the contract method 0x6681792d.
//
// Solidity: function getCodeLanguage() view returns(string)
func (_AgentUpgradeable *AgentUpgradeableCallerSession) GetCodeLanguage() (string, error) {
	return _AgentUpgradeable.Contract.GetCodeLanguage(&_AgentUpgradeable.CallOpts)
}

// GetCurrentVersion is a free data retrieval call binding the contract method 0xfabec44a.
//
// Solidity: function getCurrentVersion() view returns(uint16)
func (_AgentUpgradeable *AgentUpgradeableCaller) GetCurrentVersion(opts *bind.CallOpts) (uint16, error) {
	var out []interface{}
	err := _AgentUpgradeable.contract.Call(opts, &out, "getCurrentVersion")

	if err != nil {
		return *new(uint16), err
	}

	out0 := *abi.ConvertType(out[0], new(uint16)).(*uint16)

	return out0, err

}

// GetCurrentVersion is a free data retrieval call binding the contract method 0xfabec44a.
//
// Solidity: function getCurrentVersion() view returns(uint16)
func (_AgentUpgradeable *AgentUpgradeableSession) GetCurrentVersion() (uint16, error) {
	return _AgentUpgradeable.Contract.GetCurrentVersion(&_AgentUpgradeable.CallOpts)
}

// GetCurrentVersion is a free data retrieval call binding the contract method 0xfabec44a.
//
// Solidity: function getCurrentVersion() view returns(uint16)
func (_AgentUpgradeable *AgentUpgradeableCallerSession) GetCurrentVersion() (uint16, error) {
	return _AgentUpgradeable.Contract.GetCurrentVersion(&_AgentUpgradeable.CallOpts)
}

// GetDepsAgents is a free data retrieval call binding the contract method 0xfa0d4179.
//
// Solidity: function getDepsAgents(uint16 version) view returns(address[])
func (_AgentUpgradeable *AgentUpgradeableCaller) GetDepsAgents(opts *bind.CallOpts, version uint16) ([]common.Address, error) {
	var out []interface{}
	err := _AgentUpgradeable.contract.Call(opts, &out, "getDepsAgents", version)

	if err != nil {
		return *new([]common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new([]common.Address)).(*[]common.Address)

	return out0, err

}

// GetDepsAgents is a free data retrieval call binding the contract method 0xfa0d4179.
//
// Solidity: function getDepsAgents(uint16 version) view returns(address[])
func (_AgentUpgradeable *AgentUpgradeableSession) GetDepsAgents(version uint16) ([]common.Address, error) {
	return _AgentUpgradeable.Contract.GetDepsAgents(&_AgentUpgradeable.CallOpts, version)
}

// GetDepsAgents is a free data retrieval call binding the contract method 0xfa0d4179.
//
// Solidity: function getDepsAgents(uint16 version) view returns(address[])
func (_AgentUpgradeable *AgentUpgradeableCallerSession) GetDepsAgents(version uint16) ([]common.Address, error) {
	return _AgentUpgradeable.Contract.GetDepsAgents(&_AgentUpgradeable.CallOpts, version)
}

// GetHashToSign is a free data retrieval call binding the contract method 0xb095e56a.
//
// Solidity: function getHashToSign((address,uint8,string)[] pointers, address[] depsAgents, bool isOnchain) view returns(bytes32)
func (_AgentUpgradeable *AgentUpgradeableCaller) GetHashToSign(opts *bind.CallOpts, pointers []IAgentCodePointer, depsAgents []common.Address, isOnchain bool) ([32]byte, error) {
	var out []interface{}
	err := _AgentUpgradeable.contract.Call(opts, &out, "getHashToSign", pointers, depsAgents, isOnchain)

	if err != nil {
		return *new([32]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)

	return out0, err

}

// GetHashToSign is a free data retrieval call binding the contract method 0xb095e56a.
//
// Solidity: function getHashToSign((address,uint8,string)[] pointers, address[] depsAgents, bool isOnchain) view returns(bytes32)
func (_AgentUpgradeable *AgentUpgradeableSession) GetHashToSign(pointers []IAgentCodePointer, depsAgents []common.Address, isOnchain bool) ([32]byte, error) {
	return _AgentUpgradeable.Contract.GetHashToSign(&_AgentUpgradeable.CallOpts, pointers, depsAgents, isOnchain)
}

// GetHashToSign is a free data retrieval call binding the contract method 0xb095e56a.
//
// Solidity: function getHashToSign((address,uint8,string)[] pointers, address[] depsAgents, bool isOnchain) view returns(bytes32)
func (_AgentUpgradeable *AgentUpgradeableCallerSession) GetHashToSign(pointers []IAgentCodePointer, depsAgents []common.Address, isOnchain bool) ([32]byte, error) {
	return _AgentUpgradeable.Contract.GetHashToSign(&_AgentUpgradeable.CallOpts, pointers, depsAgents, isOnchain)
}

// IsOnchain is a free data retrieval call binding the contract method 0x23b01cfa.
//
// Solidity: function isOnchain(uint256 version) view returns(bool)
func (_AgentUpgradeable *AgentUpgradeableCaller) IsOnchain(opts *bind.CallOpts, version *big.Int) (bool, error) {
	var out []interface{}
	err := _AgentUpgradeable.contract.Call(opts, &out, "isOnchain", version)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsOnchain is a free data retrieval call binding the contract method 0x23b01cfa.
//
// Solidity: function isOnchain(uint256 version) view returns(bool)
func (_AgentUpgradeable *AgentUpgradeableSession) IsOnchain(version *big.Int) (bool, error) {
	return _AgentUpgradeable.Contract.IsOnchain(&_AgentUpgradeable.CallOpts, version)
}

// IsOnchain is a free data retrieval call binding the contract method 0x23b01cfa.
//
// Solidity: function isOnchain(uint256 version) view returns(bool)
func (_AgentUpgradeable *AgentUpgradeableCallerSession) IsOnchain(version *big.Int) (bool, error) {
	return _AgentUpgradeable.Contract.IsOnchain(&_AgentUpgradeable.CallOpts, version)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_AgentUpgradeable *AgentUpgradeableCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _AgentUpgradeable.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_AgentUpgradeable *AgentUpgradeableSession) Owner() (common.Address, error) {
	return _AgentUpgradeable.Contract.Owner(&_AgentUpgradeable.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_AgentUpgradeable *AgentUpgradeableCallerSession) Owner() (common.Address, error) {
	return _AgentUpgradeable.Contract.Owner(&_AgentUpgradeable.CallOpts)
}

// Initialize is a paid mutator transaction binding the contract method 0x7109e143.
//
// Solidity: function initialize(string agentName, string agentVersion, string codeLanguage, (address,uint8,string)[] pointers, address[] depsAgents, address agentOwner, bool isOnchain) returns()
func (_AgentUpgradeable *AgentUpgradeableTransactor) Initialize(opts *bind.TransactOpts, agentName string, agentVersion string, codeLanguage string, pointers []IAgentCodePointer, depsAgents []common.Address, agentOwner common.Address, isOnchain bool) (*types.Transaction, error) {
	return _AgentUpgradeable.contract.Transact(opts, "initialize", agentName, agentVersion, codeLanguage, pointers, depsAgents, agentOwner, isOnchain)
}

// Initialize is a paid mutator transaction binding the contract method 0x7109e143.
//
// Solidity: function initialize(string agentName, string agentVersion, string codeLanguage, (address,uint8,string)[] pointers, address[] depsAgents, address agentOwner, bool isOnchain) returns()
func (_AgentUpgradeable *AgentUpgradeableSession) Initialize(agentName string, agentVersion string, codeLanguage string, pointers []IAgentCodePointer, depsAgents []common.Address, agentOwner common.Address, isOnchain bool) (*types.Transaction, error) {
	return _AgentUpgradeable.Contract.Initialize(&_AgentUpgradeable.TransactOpts, agentName, agentVersion, codeLanguage, pointers, depsAgents, agentOwner, isOnchain)
}

// Initialize is a paid mutator transaction binding the contract method 0x7109e143.
//
// Solidity: function initialize(string agentName, string agentVersion, string codeLanguage, (address,uint8,string)[] pointers, address[] depsAgents, address agentOwner, bool isOnchain) returns()
func (_AgentUpgradeable *AgentUpgradeableTransactorSession) Initialize(agentName string, agentVersion string, codeLanguage string, pointers []IAgentCodePointer, depsAgents []common.Address, agentOwner common.Address, isOnchain bool) (*types.Transaction, error) {
	return _AgentUpgradeable.Contract.Initialize(&_AgentUpgradeable.TransactOpts, agentName, agentVersion, codeLanguage, pointers, depsAgents, agentOwner, isOnchain)
}

// PublishAgentCode is a paid mutator transaction binding the contract method 0x9de79e65.
//
// Solidity: function publishAgentCode((address,uint8,string)[] pointers, address[] depsAgents, bool isOnchain) returns(uint16)
func (_AgentUpgradeable *AgentUpgradeableTransactor) PublishAgentCode(opts *bind.TransactOpts, pointers []IAgentCodePointer, depsAgents []common.Address, isOnchain bool) (*types.Transaction, error) {
	return _AgentUpgradeable.contract.Transact(opts, "publishAgentCode", pointers, depsAgents, isOnchain)
}

// PublishAgentCode is a paid mutator transaction binding the contract method 0x9de79e65.
//
// Solidity: function publishAgentCode((address,uint8,string)[] pointers, address[] depsAgents, bool isOnchain) returns(uint16)
func (_AgentUpgradeable *AgentUpgradeableSession) PublishAgentCode(pointers []IAgentCodePointer, depsAgents []common.Address, isOnchain bool) (*types.Transaction, error) {
	return _AgentUpgradeable.Contract.PublishAgentCode(&_AgentUpgradeable.TransactOpts, pointers, depsAgents, isOnchain)
}

// PublishAgentCode is a paid mutator transaction binding the contract method 0x9de79e65.
//
// Solidity: function publishAgentCode((address,uint8,string)[] pointers, address[] depsAgents, bool isOnchain) returns(uint16)
func (_AgentUpgradeable *AgentUpgradeableTransactorSession) PublishAgentCode(pointers []IAgentCodePointer, depsAgents []common.Address, isOnchain bool) (*types.Transaction, error) {
	return _AgentUpgradeable.Contract.PublishAgentCode(&_AgentUpgradeable.TransactOpts, pointers, depsAgents, isOnchain)
}

// PublishAgentCodeWithSignature is a paid mutator transaction binding the contract method 0x45a836ec.
//
// Solidity: function publishAgentCodeWithSignature((address,uint8,string)[] pointers, address[] depsAgents, bool isOnchain, bytes signature) returns(uint16)
func (_AgentUpgradeable *AgentUpgradeableTransactor) PublishAgentCodeWithSignature(opts *bind.TransactOpts, pointers []IAgentCodePointer, depsAgents []common.Address, isOnchain bool, signature []byte) (*types.Transaction, error) {
	return _AgentUpgradeable.contract.Transact(opts, "publishAgentCodeWithSignature", pointers, depsAgents, isOnchain, signature)
}

// PublishAgentCodeWithSignature is a paid mutator transaction binding the contract method 0x45a836ec.
//
// Solidity: function publishAgentCodeWithSignature((address,uint8,string)[] pointers, address[] depsAgents, bool isOnchain, bytes signature) returns(uint16)
func (_AgentUpgradeable *AgentUpgradeableSession) PublishAgentCodeWithSignature(pointers []IAgentCodePointer, depsAgents []common.Address, isOnchain bool, signature []byte) (*types.Transaction, error) {
	return _AgentUpgradeable.Contract.PublishAgentCodeWithSignature(&_AgentUpgradeable.TransactOpts, pointers, depsAgents, isOnchain, signature)
}

// PublishAgentCodeWithSignature is a paid mutator transaction binding the contract method 0x45a836ec.
//
// Solidity: function publishAgentCodeWithSignature((address,uint8,string)[] pointers, address[] depsAgents, bool isOnchain, bytes signature) returns(uint16)
func (_AgentUpgradeable *AgentUpgradeableTransactorSession) PublishAgentCodeWithSignature(pointers []IAgentCodePointer, depsAgents []common.Address, isOnchain bool, signature []byte) (*types.Transaction, error) {
	return _AgentUpgradeable.Contract.PublishAgentCodeWithSignature(&_AgentUpgradeable.TransactOpts, pointers, depsAgents, isOnchain, signature)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_AgentUpgradeable *AgentUpgradeableTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AgentUpgradeable.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_AgentUpgradeable *AgentUpgradeableSession) RenounceOwnership() (*types.Transaction, error) {
	return _AgentUpgradeable.Contract.RenounceOwnership(&_AgentUpgradeable.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_AgentUpgradeable *AgentUpgradeableTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _AgentUpgradeable.Contract.RenounceOwnership(&_AgentUpgradeable.TransactOpts)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_AgentUpgradeable *AgentUpgradeableTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _AgentUpgradeable.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_AgentUpgradeable *AgentUpgradeableSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _AgentUpgradeable.Contract.TransferOwnership(&_AgentUpgradeable.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_AgentUpgradeable *AgentUpgradeableTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _AgentUpgradeable.Contract.TransferOwnership(&_AgentUpgradeable.TransactOpts, newOwner)
}

// AgentUpgradeableCodePointerCreatedIterator is returned from FilterCodePointerCreated and is used to iterate over the raw logs and unpacked data for CodePointerCreated events raised by the AgentUpgradeable contract.
type AgentUpgradeableCodePointerCreatedIterator struct {
	Event *AgentUpgradeableCodePointerCreated // Event containing the contract specifics and raw log

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
func (it *AgentUpgradeableCodePointerCreatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AgentUpgradeableCodePointerCreated)
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
		it.Event = new(AgentUpgradeableCodePointerCreated)
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
func (it *AgentUpgradeableCodePointerCreatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AgentUpgradeableCodePointerCreatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AgentUpgradeableCodePointerCreated represents a CodePointerCreated event raised by the AgentUpgradeable contract.
type AgentUpgradeableCodePointerCreated struct {
	Version    *big.Int
	PIndex     *big.Int
	NewPointer IAgentCodePointer
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterCodePointerCreated is a free log retrieval operation binding the contract event 0x0c69de805f518c322126e1fa81f2e91d814412a2ad304638fcaed200bd7f43dc.
//
// Solidity: event CodePointerCreated(uint256 indexed version, uint256 indexed pIndex, (address,uint8,string) newPointer)
func (_AgentUpgradeable *AgentUpgradeableFilterer) FilterCodePointerCreated(opts *bind.FilterOpts, version []*big.Int, pIndex []*big.Int) (*AgentUpgradeableCodePointerCreatedIterator, error) {

	var versionRule []interface{}
	for _, versionItem := range version {
		versionRule = append(versionRule, versionItem)
	}
	var pIndexRule []interface{}
	for _, pIndexItem := range pIndex {
		pIndexRule = append(pIndexRule, pIndexItem)
	}

	logs, sub, err := _AgentUpgradeable.contract.FilterLogs(opts, "CodePointerCreated", versionRule, pIndexRule)
	if err != nil {
		return nil, err
	}
	return &AgentUpgradeableCodePointerCreatedIterator{contract: _AgentUpgradeable.contract, event: "CodePointerCreated", logs: logs, sub: sub}, nil
}

// WatchCodePointerCreated is a free log subscription operation binding the contract event 0x0c69de805f518c322126e1fa81f2e91d814412a2ad304638fcaed200bd7f43dc.
//
// Solidity: event CodePointerCreated(uint256 indexed version, uint256 indexed pIndex, (address,uint8,string) newPointer)
func (_AgentUpgradeable *AgentUpgradeableFilterer) WatchCodePointerCreated(opts *bind.WatchOpts, sink chan<- *AgentUpgradeableCodePointerCreated, version []*big.Int, pIndex []*big.Int) (event.Subscription, error) {

	var versionRule []interface{}
	for _, versionItem := range version {
		versionRule = append(versionRule, versionItem)
	}
	var pIndexRule []interface{}
	for _, pIndexItem := range pIndex {
		pIndexRule = append(pIndexRule, pIndexItem)
	}

	logs, sub, err := _AgentUpgradeable.contract.WatchLogs(opts, "CodePointerCreated", versionRule, pIndexRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AgentUpgradeableCodePointerCreated)
				if err := _AgentUpgradeable.contract.UnpackLog(event, "CodePointerCreated", log); err != nil {
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

// ParseCodePointerCreated is a log parse operation binding the contract event 0x0c69de805f518c322126e1fa81f2e91d814412a2ad304638fcaed200bd7f43dc.
//
// Solidity: event CodePointerCreated(uint256 indexed version, uint256 indexed pIndex, (address,uint8,string) newPointer)
func (_AgentUpgradeable *AgentUpgradeableFilterer) ParseCodePointerCreated(log types.Log) (*AgentUpgradeableCodePointerCreated, error) {
	event := new(AgentUpgradeableCodePointerCreated)
	if err := _AgentUpgradeable.contract.UnpackLog(event, "CodePointerCreated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// AgentUpgradeableEIP712DomainChangedIterator is returned from FilterEIP712DomainChanged and is used to iterate over the raw logs and unpacked data for EIP712DomainChanged events raised by the AgentUpgradeable contract.
type AgentUpgradeableEIP712DomainChangedIterator struct {
	Event *AgentUpgradeableEIP712DomainChanged // Event containing the contract specifics and raw log

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
func (it *AgentUpgradeableEIP712DomainChangedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AgentUpgradeableEIP712DomainChanged)
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
		it.Event = new(AgentUpgradeableEIP712DomainChanged)
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
func (it *AgentUpgradeableEIP712DomainChangedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AgentUpgradeableEIP712DomainChangedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AgentUpgradeableEIP712DomainChanged represents a EIP712DomainChanged event raised by the AgentUpgradeable contract.
type AgentUpgradeableEIP712DomainChanged struct {
	Raw types.Log // Blockchain specific contextual infos
}

// FilterEIP712DomainChanged is a free log retrieval operation binding the contract event 0x0a6387c9ea3628b88a633bb4f3b151770f70085117a15f9bf3787cda53f13d31.
//
// Solidity: event EIP712DomainChanged()
func (_AgentUpgradeable *AgentUpgradeableFilterer) FilterEIP712DomainChanged(opts *bind.FilterOpts) (*AgentUpgradeableEIP712DomainChangedIterator, error) {

	logs, sub, err := _AgentUpgradeable.contract.FilterLogs(opts, "EIP712DomainChanged")
	if err != nil {
		return nil, err
	}
	return &AgentUpgradeableEIP712DomainChangedIterator{contract: _AgentUpgradeable.contract, event: "EIP712DomainChanged", logs: logs, sub: sub}, nil
}

// WatchEIP712DomainChanged is a free log subscription operation binding the contract event 0x0a6387c9ea3628b88a633bb4f3b151770f70085117a15f9bf3787cda53f13d31.
//
// Solidity: event EIP712DomainChanged()
func (_AgentUpgradeable *AgentUpgradeableFilterer) WatchEIP712DomainChanged(opts *bind.WatchOpts, sink chan<- *AgentUpgradeableEIP712DomainChanged) (event.Subscription, error) {

	logs, sub, err := _AgentUpgradeable.contract.WatchLogs(opts, "EIP712DomainChanged")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AgentUpgradeableEIP712DomainChanged)
				if err := _AgentUpgradeable.contract.UnpackLog(event, "EIP712DomainChanged", log); err != nil {
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
func (_AgentUpgradeable *AgentUpgradeableFilterer) ParseEIP712DomainChanged(log types.Log) (*AgentUpgradeableEIP712DomainChanged, error) {
	event := new(AgentUpgradeableEIP712DomainChanged)
	if err := _AgentUpgradeable.contract.UnpackLog(event, "EIP712DomainChanged", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// AgentUpgradeableInitializedIterator is returned from FilterInitialized and is used to iterate over the raw logs and unpacked data for Initialized events raised by the AgentUpgradeable contract.
type AgentUpgradeableInitializedIterator struct {
	Event *AgentUpgradeableInitialized // Event containing the contract specifics and raw log

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
func (it *AgentUpgradeableInitializedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AgentUpgradeableInitialized)
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
		it.Event = new(AgentUpgradeableInitialized)
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
func (it *AgentUpgradeableInitializedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AgentUpgradeableInitializedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AgentUpgradeableInitialized represents a Initialized event raised by the AgentUpgradeable contract.
type AgentUpgradeableInitialized struct {
	Version uint8
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterInitialized is a free log retrieval operation binding the contract event 0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498.
//
// Solidity: event Initialized(uint8 version)
func (_AgentUpgradeable *AgentUpgradeableFilterer) FilterInitialized(opts *bind.FilterOpts) (*AgentUpgradeableInitializedIterator, error) {

	logs, sub, err := _AgentUpgradeable.contract.FilterLogs(opts, "Initialized")
	if err != nil {
		return nil, err
	}
	return &AgentUpgradeableInitializedIterator{contract: _AgentUpgradeable.contract, event: "Initialized", logs: logs, sub: sub}, nil
}

// WatchInitialized is a free log subscription operation binding the contract event 0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498.
//
// Solidity: event Initialized(uint8 version)
func (_AgentUpgradeable *AgentUpgradeableFilterer) WatchInitialized(opts *bind.WatchOpts, sink chan<- *AgentUpgradeableInitialized) (event.Subscription, error) {

	logs, sub, err := _AgentUpgradeable.contract.WatchLogs(opts, "Initialized")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AgentUpgradeableInitialized)
				if err := _AgentUpgradeable.contract.UnpackLog(event, "Initialized", log); err != nil {
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
func (_AgentUpgradeable *AgentUpgradeableFilterer) ParseInitialized(log types.Log) (*AgentUpgradeableInitialized, error) {
	event := new(AgentUpgradeableInitialized)
	if err := _AgentUpgradeable.contract.UnpackLog(event, "Initialized", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// AgentUpgradeableOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the AgentUpgradeable contract.
type AgentUpgradeableOwnershipTransferredIterator struct {
	Event *AgentUpgradeableOwnershipTransferred // Event containing the contract specifics and raw log

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
func (it *AgentUpgradeableOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AgentUpgradeableOwnershipTransferred)
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
		it.Event = new(AgentUpgradeableOwnershipTransferred)
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
func (it *AgentUpgradeableOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AgentUpgradeableOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AgentUpgradeableOwnershipTransferred represents a OwnershipTransferred event raised by the AgentUpgradeable contract.
type AgentUpgradeableOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_AgentUpgradeable *AgentUpgradeableFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*AgentUpgradeableOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _AgentUpgradeable.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &AgentUpgradeableOwnershipTransferredIterator{contract: _AgentUpgradeable.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_AgentUpgradeable *AgentUpgradeableFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *AgentUpgradeableOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _AgentUpgradeable.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AgentUpgradeableOwnershipTransferred)
				if err := _AgentUpgradeable.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
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
func (_AgentUpgradeable *AgentUpgradeableFilterer) ParseOwnershipTransferred(log types.Log) (*AgentUpgradeableOwnershipTransferred, error) {
	event := new(AgentUpgradeableOwnershipTransferred)
	if err := _AgentUpgradeable.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
