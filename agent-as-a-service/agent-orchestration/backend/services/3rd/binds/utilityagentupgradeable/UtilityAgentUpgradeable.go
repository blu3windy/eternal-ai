// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package utilityagentupgradeable

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

// IUtilityAgentStorageInfo is an auto generated low-level Go binding around an user-defined struct.
type IUtilityAgentStorageInfo struct {
	ContractAddress common.Address
	Filename        string
}

// UtilityAgentUpgradeableMetaData contains all meta data concerning the UtilityAgentUpgradeable contract.
var UtilityAgentUpgradeableMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[],\"name\":\"InvalidData\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"ZeroAddress\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"key\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"value\",\"type\":\"string\"}],\"name\":\"EndpointUpdate\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint8\",\"name\":\"version\",\"type\":\"uint8\"}],\"name\":\"Initialized\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"cfIndex\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"contractAddress\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"filename\",\"type\":\"string\"}],\"indexed\":false,\"internalType\":\"structIUtilityAgent.StorageInfo\",\"name\":\"newInfo\",\"type\":\"tuple\"}],\"name\":\"StorageInfoUpdate\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"newSystemPrompt\",\"type\":\"string\"}],\"name\":\"SystemPromptUpdate\",\"type\":\"event\"},{\"inputs\":[{\"components\":[{\"internalType\":\"address\",\"name\":\"contractAddress\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"filename\",\"type\":\"string\"}],\"internalType\":\"structIUtilityAgent.StorageInfo\",\"name\":\"storageInfo\",\"type\":\"tuple\"}],\"name\":\"addNewStorageInfo\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"fetchAllFileCodes\",\"outputs\":[{\"internalType\":\"string[]\",\"name\":\"filename\",\"type\":\"string[]\"},{\"internalType\":\"string[]\",\"name\":\"logic\",\"type\":\"string[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"address\",\"name\":\"contractAddress\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"filename\",\"type\":\"string\"}],\"internalType\":\"structIUtilityAgent.StorageInfo\",\"name\":\"config\",\"type\":\"tuple\"}],\"name\":\"fetchFileCodeFromConfig\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"logic\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getConfigsNumber\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"key\",\"type\":\"string\"}],\"name\":\"getEndpoint\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"value\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getStorageInfo\",\"outputs\":[{\"components\":[{\"internalType\":\"address\",\"name\":\"contractAddress\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"filename\",\"type\":\"string\"}],\"internalType\":\"structIUtilityAgent.StorageInfo[]\",\"name\":\"configs\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"address\",\"name\":\"contractAddress\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"filename\",\"type\":\"string\"}],\"internalType\":\"structIUtilityAgent.StorageInfo\",\"name\":\"config\",\"type\":\"tuple\"}],\"name\":\"getStorageMode\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getSystemPrompt\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"systemPrompt_\",\"type\":\"string\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"contractAddress\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"filename\",\"type\":\"string\"}],\"internalType\":\"structIUtilityAgent.StorageInfo[]\",\"name\":\"storageInfos_\",\"type\":\"tuple[]\"}],\"name\":\"initialize\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"key\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"value\",\"type\":\"string\"}],\"name\":\"updateEndpoint\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string[]\",\"name\":\"keys\",\"type\":\"string[]\"},{\"internalType\":\"string[]\",\"name\":\"values\",\"type\":\"string[]\"}],\"name\":\"updateEndpoints\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"cfIndex\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"contractAddress\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"filename\",\"type\":\"string\"}],\"internalType\":\"structIUtilityAgent.StorageInfo\",\"name\":\"storageInfo\",\"type\":\"tuple\"}],\"name\":\"updateStorageInfo\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"systemPrompt\",\"type\":\"string\"}],\"name\":\"updateSystemPrompt\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
	Bin: "0x608080604052346100165761236d908161001c8239f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c806307679a64146101175780631006c98b146101125780635aa69c171461010d5780636cece16314610108578063715018a61461010357806376a30029146100fe578063816dea16146100f95780638da5cb5b146100f4578063a7a707f4146100ef578063aab24f97146100ea578063ba84ddbf146100e5578063be2d4464146100e0578063e702c420146100db578063edfa037f146100d6578063f2fde38b146100d15763f9be7f6d146100cc57600080fd5b6112db565b6111ef565b6110fa565b610f5f565b610e78565b610e5f565b610c2b565b610c12565b610b18565b610982565b610693565b6105f4565b6103e6565b6103a2565b6102c6565b61018e565b919082519283825260005b8481106101665750507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8460006020809697860101520116010190565b602081830181015184830182015201610127565b90602061018b92818152019061011c565b90565b346102b3576000807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126102b0576040519080606554906101d082611563565b80855291602091600191828116908115610265575060011461020d575b610209866101fd8188038261089b565b6040519182918261017a565b0390f35b9350606584527f8ff97419363ffd7000167f130ef7168fbea05faf9251824ca5043f113cc6a7c75b838510610252575050505081016020016101fd82610209386101ed565b8054868601840152938201938101610235565b879650610209979450602093506101fd9592507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0091501682840152151560051b8201019293386101ed565b80fd5b600080fd5b908160409103126102b35790565b346102b35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126102b35760043567ffffffffffffffff81116102b3576103186103259136906004016102b8565b610320611e0e565b611f78565b005b9181601f840112156102b35782359167ffffffffffffffff83116102b357602083818601950101116102b357565b60207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc8201126102b3576004359067ffffffffffffffff82116102b35761039e91600401610327565b9091565b346102b3576102096103d260206103b836610355565b9190826040519384928337810160668152030190206115b6565b60405191829160208352602083019061011c565b346102b35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126102b35767ffffffffffffffff6004358181116102b357610436903690600401610327565b906024358381116102b35761044f903690600401610327565b93610458611e0e565b6040518484823784810190606682526020818193030190209186116105ef5761048b866104858454611563565b846116ec565b600090601f871160011461051f5750918591610500837f9db1902c64383c2dd35b70e6329e4511000fe9f53761fa099fd0559951be83709861050f96600091610514575b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8260011b9260031b1c19161790565b90555b60405194859485611781565b0390a1005b9050840135386104cf565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0871661055284600052602060002090565b9282905b8282106105d7575050918793917f9db1902c64383c2dd35b70e6329e4511000fe9f53761fa099fd0559951be83709861050f96941061059f575b5050600183811b019055610503565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60f88660031b161c19908401351690553880610590565b80600185968294968a01358155019501930190610556565b610834565b346102b3576000807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126102b05761062c611e0e565b8073ffffffffffffffffffffffffffffffffffffffff6033547fffffffffffffffffffffffff00000000000000000000000000000000000000008116603355167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b346102b3576106a136610355565b6106a9611e0e565b67ffffffffffffffff81116105ef576106cc816106c7606554611563565b61167a565b600091601f82116001146107575761073982807fdf5a31f32f865da404304d8e717e689823eab72d259d756d85fc552ef9ac78d89560009161074c57507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8260011b9260031b1c19161790565b6065555b61050f604051928392836121cd565b9050830135386104cf565b60656000527f8ff97419363ffd7000167f130ef7168fbea05faf9251824ca5043f113cc6a7c77fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08316845b81811061081c575093837fdf5a31f32f865da404304d8e717e689823eab72d259d756d85fc552ef9ac78d895106107e4575b5050600182811b0160655561073d565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60f88560031b161c199083013516905538806107d4565b838601358355602095860195600190930192016107a2565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040810190811067ffffffffffffffff8211176105ef57604052565b6060810190811067ffffffffffffffff8211176105ef57604052565b90601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0910116810190811067ffffffffffffffff8211176105ef57604052565b81601f820112156102b35780359067ffffffffffffffff82116105ef576040519261092f60207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f860116018561089b565b828452602083830101116102b357816000926020809301838601378301015290565b9181601f840112156102b35782359167ffffffffffffffff83116102b3576020808501948460051b0101116102b357565b346102b35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126102b35767ffffffffffffffff6004358181116102b3576109d29036906004016108dc565b906024359081116102b3576109ee610a4e913690600401610951565b9060005493610a1460ff8660081c161580968197610b0a575b8115610aea575b506117a8565b84610a4560017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff006000541617600055565b610ab4576118a7565b610a5457005b610a817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff60005416600055565b604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb384740249890806020810161050f565b610ae56101007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff6000541617600055565b6118a7565b303b15915081610afc575b5038610a0e565b6001915060ff161438610af5565b600160ff8216109150610a07565b346102b35760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126102b357602073ffffffffffffffffffffffffffffffffffffffff60335416604051908152f35b73ffffffffffffffffffffffffffffffffffffffff8116036102b357565b7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc6020818301126102b3576004359167ffffffffffffffff918284116102b35760409084830301126102b35760405192610be184610863565b8060040135610bef81610b6a565b845260248101359283116102b357610c0a92016004016108dc565b602082015290565b346102b3576102096103d2610c2636610b88565b611a74565b346102b3576040807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126102b35767ffffffffffffffff906004358281116102b357610c7d903690600401610951565b90916024358481116102b357610c97903690600401610951565b949092610ca2611e0e565b60005b818110610cae57005b610cb9818388611b22565b90610cc5838a89611b22565b90610cce611e0e565b8751848482378085810160668152602092839103019020908884116105ef57610cfb846104858454611563565b600090601f8511600114610d8b5750927f9db1902c64383c2dd35b70e6329e4511000fe9f53761fa099fd0559951be83709492610d8292610d74838060019b9a9860009161051457507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8260011b9260031b1c19161790565b90555b8a5194859485611781565b0390a101610ca5565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08516610dbe84600052602060002090565b9282905b828210610e475750509285927f9db1902c64383c2dd35b70e6329e4511000fe9f53761fa099fd0559951be837097959260019a9997610d829610610e0f575b50508883811b019055610d77565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60f88660031b161c19908401351690553880610e01565b80600185968294968a01358155019501930190610dc2565b346102b3576102096103d2610e7336610b88565b611c56565b346102b35760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126102b3576020606754604051908152f35b6020808201908083528351809252604092604081018260408560051b8401019601946000925b858410610eeb575050505050505090565b909192939495968580610f4e837fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0866001960301885286838d5173ffffffffffffffffffffffffffffffffffffffff81511684520151918185820152019061011c565b990194019401929594939190610eda565b346102b3576000807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126102b057606754610f9b81611b39565b916040610fab604051948561089b565b8284527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0610fd884611b39565b0190825b828110611037575050505b818110610ffc57604051806102098582610eb4565b8061101b6110166001936000526068602052604060002090565b611d6c565b6110258286611d58565b526110308185611d58565b5001610fe7565b602090825161104581610863565b85815282606081830152828901015201610fdc565b90808251908181526020809101926020808460051b8301019501936000915b8483106110895750505050505090565b90919293949584806110c5837fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe086600196030187528a5161011c565b9801930193019194939290611079565b90916110ec61018b9360408452604084019061105a565b91602081840391015261105a565b346102b3576000807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126102b05760675461113681611da7565b9061114081611da7565b92805b82811061115c57505050610209604051928392836110d5565b8060019183526111d3606860208181526111ca8560409361118082868b20016115b6565b61118a888d611d58565b52611195878c611d58565b5086895283528388209351936111aa85610863565b73ffffffffffffffffffffffffffffffffffffffff8154168552016115b6565b90820152611c56565b6111dd8288611d58565b526111e88187611d58565b5001611143565b346102b35760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126102b35760043561122a81610b6a565b611232611e0e565b73ffffffffffffffffffffffffffffffffffffffff8116156112575761032590612160565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152fd5b346102b35760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126102b35767ffffffffffffffff6004356024358281116102b35761132e9036906004016102b8565b611336611e0e565b606754821015611539576000928284526020606860205260408520906113a1843561136081610b6a565b839073ffffffffffffffffffffffffffffffffffffffff167fffffffffffffffffffffffff0000000000000000000000000000000000000000825416179055565b6001809201926113b46020860186611ad1565b93909184116105ef576113d1846113cb8754611563565b876116ec565b8792601f8511600114611466575050827f3fe2087e82e481aaf992df5fc081662871648262a7de10078503707a657fa24b95936114559593611446938a9261145b575b50507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8260011b9260031b1c19161790565b90555b60405191829182611e8d565b0390a280f35b013590503880611414565b92907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe085169061149b87600052602060002090565b948a915b838310611522575050509260019285927f3fe2087e82e481aaf992df5fc081662871648262a7de10078503707a657fa24b98966114559896106114ea575b505050811b019055611449565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60f88560031b161c199101351690553880806114dd565b85850135875595860195938101939181019161149f565b60046040517f5cb045db000000000000000000000000000000000000000000000000000000008152fd5b90600182811c921680156115ac575b602083101461157d57565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b91607f1691611572565b906040519182600082546115c981611563565b9081845260209460019160018116908160001461163957506001146115fa575b5050506115f89250038361089b565b565b600090815285812095935091905b8183106116215750506115f893508201013880806115e9565b85548884018501529485019487945091830191611608565b9150506115f89593507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0091501682840152151560051b8201013880806115e9565b601f8111611686575050565b60009060656000527f8ff97419363ffd7000167f130ef7168fbea05faf9251824ca5043f113cc6a7c7906020601f850160051c830194106116e2575b601f0160051c01915b8281106116d757505050565b8181556001016116cb565b90925082906116c2565b90601f81116116fa57505050565b6000916000526020600020906020601f850160051c83019410611738575b601f0160051c01915b82811061172d57505050565b818155600101611721565b9092508290611718565b601f82602094937fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0938186528686013760008582860101520116010190565b929061179a9061018b9593604086526040860191611742565b926020818503910152611742565b156117af57565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a65640000000000000000000000000000000000006064820152fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b91908110156118a25760051b810135907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc1813603018212156102b3570190565b611833565b92916118c360ff60005460081c166118be816121de565b6121de565b6118cc33612160565b835167ffffffffffffffff81116105ef576118ec816106c7606554611563565b602080601f83116001146119725750819061193d939495966000926119675750507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8260011b9260031b1c19161790565b6065555b60005b81811061195057505050565b806119616103206001938587611862565b01611944565b015190503880611414565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08316966119c360656000527f8ff97419363ffd7000167f130ef7168fbea05faf9251824ca5043f113cc6a7c790565b926000905b898210611a2357505083600195969798106119ec575b505050811b01606555611941565b01517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60f88460031b161c191690553880806119de565b806001859682949686015181550195019301906119c8565b60405190611a4882610863565b600482527f69706673000000000000000000000000000000000000000000000000000000006020830152565b5173ffffffffffffffffffffffffffffffffffffffff1615611ac957604051611a9c81610863565b600281527f6673000000000000000000000000000000000000000000000000000000000000602082015290565b61018b611a3b565b9035907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe1813603018212156102b3570180359067ffffffffffffffff82116102b3576020019181360383136102b357565b908210156118a25761039e9160051b810190611ad1565b67ffffffffffffffff81116105ef5760051b60200190565b519063ffffffff821682036102b357565b602080828403126102b357815167ffffffffffffffff928382116102b357019260409283858303126102b357835194611b9a86610863565b80518652838101519182116102b3570181601f820112156102b357805191611bc183611b39565b94611bce8151968761089b565b83865284860191856060809602850101938185116102b3578601925b848410611bfd5750505050505082015290565b85848303126102b3578686918451611c148161087f565b8651611c1f81610b6a565b8152611c2c838801611b51565b83820152611c3b868801611b51565b86820152815201930192611bea565b6040513d6000823e3d90fd5b611c5f81611a74565b60208151910120611c6e611a3b565b6020815191012014600014611c84576020015190565b6000816020611cdc611cc373ffffffffffffffffffffffffffffffffffffffff611d1496511673ffffffffffffffffffffffffffffffffffffffff1690565b73ffffffffffffffffffffffffffffffffffffffff1690565b9101519060405180809581947fe0876aa80000000000000000000000000000000000000000000000000000000083526004830161017a565b03915afa8015611d535761018b91600091611d30575b50612269565b611d4d91503d806000833e611d45818361089b565b810190611b62565b38611d2a565b611c4a565b80518210156118a25760209160051b010190565b90604051611d7981610863565b6020611da26001839573ffffffffffffffffffffffffffffffffffffffff8154168552016115b6565b910152565b90611db182611b39565b611dbe604051918261089b565b8281527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0611dec8294611b39565b019060005b828110611dfd57505050565b806060602080938501015201611df1565b73ffffffffffffffffffffffffffffffffffffffff603354163303611e2f57565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b906020825273ffffffffffffffffffffffffffffffffffffffff8135611eb281610b6a565b16602083015260208101357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe1823603018112156102b357016020813591019067ffffffffffffffff81116102b35780360382136102b35760608360408061018b9601520191611742565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8114611f495760010190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b606754600052602060686020526040600020611fd98335611f9881610b6a565b829073ffffffffffffffffffffffffffffffffffffffff167fffffffffffffffffffffffff0000000000000000000000000000000000000000825416179055565b600180910191611fec6020850185611ad1565b9267ffffffffffffffff84116105ef5761200a846113cb8754611563565b600092601f85116001146120a8575050926120658361209b946115f897946120a39760009261145b5750507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8260011b9260031b1c19161790565b90555b7f3fe2087e82e481aaf992df5fc081662871648262a7de10078503707a657fa24b60675492839260405191829182611e8d565b0390a2611f1c565b606755565b92907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08516906120dd87600052602060002090565b9483915b83831061214957505050936115f896936120a396936001938361209b9810612111575b505050811b019055612068565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60f88560031b161c19910135169055388080612104565b8585013587559586019593810193918101916120e1565b6033549073ffffffffffffffffffffffffffffffffffffffff80911691827fffffffffffffffffffffffff0000000000000000000000000000000000000000821617603355167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3565b91602061018b938181520191611742565b156121e557565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e670000000000000000000000000000000000000000006064820152fd5b906020809201518051906020916040805195600080945b8486106122bf57505050505050601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe091828101855201168201604052565b909192939495838760051b8301015180518686830151920151813b808211612300575082849392600195938e930394859301903c0196019493929190612280565b9260849387937f86d14d89000000000000000000000000000000000000000000000000000000008552600452602452604452606452fdfea264697066735822122007e673a49285810b4cdac22776e3e83c9097ac663e97a5975394e0c19290937764736f6c63430008160033",
}

// UtilityAgentUpgradeableABI is the input ABI used to generate the binding from.
// Deprecated: Use UtilityAgentUpgradeableMetaData.ABI instead.
var UtilityAgentUpgradeableABI = UtilityAgentUpgradeableMetaData.ABI

// UtilityAgentUpgradeableBin is the compiled bytecode used for deploying new contracts.
// Deprecated: Use UtilityAgentUpgradeableMetaData.Bin instead.
var UtilityAgentUpgradeableBin = UtilityAgentUpgradeableMetaData.Bin

// DeployUtilityAgentUpgradeable deploys a new Ethereum contract, binding an instance of UtilityAgentUpgradeable to it.
func DeployUtilityAgentUpgradeable(auth *bind.TransactOpts, backend bind.ContractBackend) (common.Address, *types.Transaction, *UtilityAgentUpgradeable, error) {
	parsed, err := UtilityAgentUpgradeableMetaData.GetAbi()
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	if parsed == nil {
		return common.Address{}, nil, nil, errors.New("GetABI returned nil")
	}

	address, tx, contract, err := bind.DeployContract(auth, *parsed, common.FromHex(UtilityAgentUpgradeableBin), backend)
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	return address, tx, &UtilityAgentUpgradeable{UtilityAgentUpgradeableCaller: UtilityAgentUpgradeableCaller{contract: contract}, UtilityAgentUpgradeableTransactor: UtilityAgentUpgradeableTransactor{contract: contract}, UtilityAgentUpgradeableFilterer: UtilityAgentUpgradeableFilterer{contract: contract}}, nil
}

// UtilityAgentUpgradeable is an auto generated Go binding around an Ethereum contract.
type UtilityAgentUpgradeable struct {
	UtilityAgentUpgradeableCaller     // Read-only binding to the contract
	UtilityAgentUpgradeableTransactor // Write-only binding to the contract
	UtilityAgentUpgradeableFilterer   // Log filterer for contract events
}

// UtilityAgentUpgradeableCaller is an auto generated read-only Go binding around an Ethereum contract.
type UtilityAgentUpgradeableCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// UtilityAgentUpgradeableTransactor is an auto generated write-only Go binding around an Ethereum contract.
type UtilityAgentUpgradeableTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// UtilityAgentUpgradeableFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type UtilityAgentUpgradeableFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// UtilityAgentUpgradeableSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type UtilityAgentUpgradeableSession struct {
	Contract     *UtilityAgentUpgradeable // Generic contract binding to set the session for
	CallOpts     bind.CallOpts            // Call options to use throughout this session
	TransactOpts bind.TransactOpts        // Transaction auth options to use throughout this session
}

// UtilityAgentUpgradeableCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type UtilityAgentUpgradeableCallerSession struct {
	Contract *UtilityAgentUpgradeableCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts                  // Call options to use throughout this session
}

// UtilityAgentUpgradeableTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type UtilityAgentUpgradeableTransactorSession struct {
	Contract     *UtilityAgentUpgradeableTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts                  // Transaction auth options to use throughout this session
}

// UtilityAgentUpgradeableRaw is an auto generated low-level Go binding around an Ethereum contract.
type UtilityAgentUpgradeableRaw struct {
	Contract *UtilityAgentUpgradeable // Generic contract binding to access the raw methods on
}

// UtilityAgentUpgradeableCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type UtilityAgentUpgradeableCallerRaw struct {
	Contract *UtilityAgentUpgradeableCaller // Generic read-only contract binding to access the raw methods on
}

// UtilityAgentUpgradeableTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type UtilityAgentUpgradeableTransactorRaw struct {
	Contract *UtilityAgentUpgradeableTransactor // Generic write-only contract binding to access the raw methods on
}

// NewUtilityAgentUpgradeable creates a new instance of UtilityAgentUpgradeable, bound to a specific deployed contract.
func NewUtilityAgentUpgradeable(address common.Address, backend bind.ContractBackend) (*UtilityAgentUpgradeable, error) {
	contract, err := bindUtilityAgentUpgradeable(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &UtilityAgentUpgradeable{UtilityAgentUpgradeableCaller: UtilityAgentUpgradeableCaller{contract: contract}, UtilityAgentUpgradeableTransactor: UtilityAgentUpgradeableTransactor{contract: contract}, UtilityAgentUpgradeableFilterer: UtilityAgentUpgradeableFilterer{contract: contract}}, nil
}

// NewUtilityAgentUpgradeableCaller creates a new read-only instance of UtilityAgentUpgradeable, bound to a specific deployed contract.
func NewUtilityAgentUpgradeableCaller(address common.Address, caller bind.ContractCaller) (*UtilityAgentUpgradeableCaller, error) {
	contract, err := bindUtilityAgentUpgradeable(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &UtilityAgentUpgradeableCaller{contract: contract}, nil
}

// NewUtilityAgentUpgradeableTransactor creates a new write-only instance of UtilityAgentUpgradeable, bound to a specific deployed contract.
func NewUtilityAgentUpgradeableTransactor(address common.Address, transactor bind.ContractTransactor) (*UtilityAgentUpgradeableTransactor, error) {
	contract, err := bindUtilityAgentUpgradeable(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &UtilityAgentUpgradeableTransactor{contract: contract}, nil
}

// NewUtilityAgentUpgradeableFilterer creates a new log filterer instance of UtilityAgentUpgradeable, bound to a specific deployed contract.
func NewUtilityAgentUpgradeableFilterer(address common.Address, filterer bind.ContractFilterer) (*UtilityAgentUpgradeableFilterer, error) {
	contract, err := bindUtilityAgentUpgradeable(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &UtilityAgentUpgradeableFilterer{contract: contract}, nil
}

// bindUtilityAgentUpgradeable binds a generic wrapper to an already deployed contract.
func bindUtilityAgentUpgradeable(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := UtilityAgentUpgradeableMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _UtilityAgentUpgradeable.Contract.UtilityAgentUpgradeableCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.UtilityAgentUpgradeableTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.UtilityAgentUpgradeableTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _UtilityAgentUpgradeable.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.contract.Transact(opts, method, params...)
}

// FetchAllFileCodes is a free data retrieval call binding the contract method 0xedfa037f.
//
// Solidity: function fetchAllFileCodes() view returns(string[] filename, string[] logic)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableCaller) FetchAllFileCodes(opts *bind.CallOpts) (struct {
	Filename []string
	Logic    []string
}, error) {
	var out []interface{}
	err := _UtilityAgentUpgradeable.contract.Call(opts, &out, "fetchAllFileCodes")

	outstruct := new(struct {
		Filename []string
		Logic    []string
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.Filename = *abi.ConvertType(out[0], new([]string)).(*[]string)
	outstruct.Logic = *abi.ConvertType(out[1], new([]string)).(*[]string)

	return *outstruct, err

}

// FetchAllFileCodes is a free data retrieval call binding the contract method 0xedfa037f.
//
// Solidity: function fetchAllFileCodes() view returns(string[] filename, string[] logic)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableSession) FetchAllFileCodes() (struct {
	Filename []string
	Logic    []string
}, error) {
	return _UtilityAgentUpgradeable.Contract.FetchAllFileCodes(&_UtilityAgentUpgradeable.CallOpts)
}

// FetchAllFileCodes is a free data retrieval call binding the contract method 0xedfa037f.
//
// Solidity: function fetchAllFileCodes() view returns(string[] filename, string[] logic)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableCallerSession) FetchAllFileCodes() (struct {
	Filename []string
	Logic    []string
}, error) {
	return _UtilityAgentUpgradeable.Contract.FetchAllFileCodes(&_UtilityAgentUpgradeable.CallOpts)
}

// FetchFileCodeFromConfig is a free data retrieval call binding the contract method 0xba84ddbf.
//
// Solidity: function fetchFileCodeFromConfig((address,string) config) view returns(string logic)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableCaller) FetchFileCodeFromConfig(opts *bind.CallOpts, config IUtilityAgentStorageInfo) (string, error) {
	var out []interface{}
	err := _UtilityAgentUpgradeable.contract.Call(opts, &out, "fetchFileCodeFromConfig", config)

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// FetchFileCodeFromConfig is a free data retrieval call binding the contract method 0xba84ddbf.
//
// Solidity: function fetchFileCodeFromConfig((address,string) config) view returns(string logic)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableSession) FetchFileCodeFromConfig(config IUtilityAgentStorageInfo) (string, error) {
	return _UtilityAgentUpgradeable.Contract.FetchFileCodeFromConfig(&_UtilityAgentUpgradeable.CallOpts, config)
}

// FetchFileCodeFromConfig is a free data retrieval call binding the contract method 0xba84ddbf.
//
// Solidity: function fetchFileCodeFromConfig((address,string) config) view returns(string logic)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableCallerSession) FetchFileCodeFromConfig(config IUtilityAgentStorageInfo) (string, error) {
	return _UtilityAgentUpgradeable.Contract.FetchFileCodeFromConfig(&_UtilityAgentUpgradeable.CallOpts, config)
}

// GetConfigsNumber is a free data retrieval call binding the contract method 0xbe2d4464.
//
// Solidity: function getConfigsNumber() view returns(uint256)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableCaller) GetConfigsNumber(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _UtilityAgentUpgradeable.contract.Call(opts, &out, "getConfigsNumber")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetConfigsNumber is a free data retrieval call binding the contract method 0xbe2d4464.
//
// Solidity: function getConfigsNumber() view returns(uint256)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableSession) GetConfigsNumber() (*big.Int, error) {
	return _UtilityAgentUpgradeable.Contract.GetConfigsNumber(&_UtilityAgentUpgradeable.CallOpts)
}

// GetConfigsNumber is a free data retrieval call binding the contract method 0xbe2d4464.
//
// Solidity: function getConfigsNumber() view returns(uint256)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableCallerSession) GetConfigsNumber() (*big.Int, error) {
	return _UtilityAgentUpgradeable.Contract.GetConfigsNumber(&_UtilityAgentUpgradeable.CallOpts)
}

// GetEndpoint is a free data retrieval call binding the contract method 0x5aa69c17.
//
// Solidity: function getEndpoint(string key) view returns(string value)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableCaller) GetEndpoint(opts *bind.CallOpts, key string) (string, error) {
	var out []interface{}
	err := _UtilityAgentUpgradeable.contract.Call(opts, &out, "getEndpoint", key)

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// GetEndpoint is a free data retrieval call binding the contract method 0x5aa69c17.
//
// Solidity: function getEndpoint(string key) view returns(string value)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableSession) GetEndpoint(key string) (string, error) {
	return _UtilityAgentUpgradeable.Contract.GetEndpoint(&_UtilityAgentUpgradeable.CallOpts, key)
}

// GetEndpoint is a free data retrieval call binding the contract method 0x5aa69c17.
//
// Solidity: function getEndpoint(string key) view returns(string value)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableCallerSession) GetEndpoint(key string) (string, error) {
	return _UtilityAgentUpgradeable.Contract.GetEndpoint(&_UtilityAgentUpgradeable.CallOpts, key)
}

// GetStorageInfo is a free data retrieval call binding the contract method 0xe702c420.
//
// Solidity: function getStorageInfo() view returns((address,string)[] configs)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableCaller) GetStorageInfo(opts *bind.CallOpts) ([]IUtilityAgentStorageInfo, error) {
	var out []interface{}
	err := _UtilityAgentUpgradeable.contract.Call(opts, &out, "getStorageInfo")

	if err != nil {
		return *new([]IUtilityAgentStorageInfo), err
	}

	out0 := *abi.ConvertType(out[0], new([]IUtilityAgentStorageInfo)).(*[]IUtilityAgentStorageInfo)

	return out0, err

}

// GetStorageInfo is a free data retrieval call binding the contract method 0xe702c420.
//
// Solidity: function getStorageInfo() view returns((address,string)[] configs)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableSession) GetStorageInfo() ([]IUtilityAgentStorageInfo, error) {
	return _UtilityAgentUpgradeable.Contract.GetStorageInfo(&_UtilityAgentUpgradeable.CallOpts)
}

// GetStorageInfo is a free data retrieval call binding the contract method 0xe702c420.
//
// Solidity: function getStorageInfo() view returns((address,string)[] configs)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableCallerSession) GetStorageInfo() ([]IUtilityAgentStorageInfo, error) {
	return _UtilityAgentUpgradeable.Contract.GetStorageInfo(&_UtilityAgentUpgradeable.CallOpts)
}

// GetStorageMode is a free data retrieval call binding the contract method 0xa7a707f4.
//
// Solidity: function getStorageMode((address,string) config) view returns(string)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableCaller) GetStorageMode(opts *bind.CallOpts, config IUtilityAgentStorageInfo) (string, error) {
	var out []interface{}
	err := _UtilityAgentUpgradeable.contract.Call(opts, &out, "getStorageMode", config)

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// GetStorageMode is a free data retrieval call binding the contract method 0xa7a707f4.
//
// Solidity: function getStorageMode((address,string) config) view returns(string)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableSession) GetStorageMode(config IUtilityAgentStorageInfo) (string, error) {
	return _UtilityAgentUpgradeable.Contract.GetStorageMode(&_UtilityAgentUpgradeable.CallOpts, config)
}

// GetStorageMode is a free data retrieval call binding the contract method 0xa7a707f4.
//
// Solidity: function getStorageMode((address,string) config) view returns(string)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableCallerSession) GetStorageMode(config IUtilityAgentStorageInfo) (string, error) {
	return _UtilityAgentUpgradeable.Contract.GetStorageMode(&_UtilityAgentUpgradeable.CallOpts, config)
}

// GetSystemPrompt is a free data retrieval call binding the contract method 0x07679a64.
//
// Solidity: function getSystemPrompt() view returns(string)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableCaller) GetSystemPrompt(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _UtilityAgentUpgradeable.contract.Call(opts, &out, "getSystemPrompt")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// GetSystemPrompt is a free data retrieval call binding the contract method 0x07679a64.
//
// Solidity: function getSystemPrompt() view returns(string)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableSession) GetSystemPrompt() (string, error) {
	return _UtilityAgentUpgradeable.Contract.GetSystemPrompt(&_UtilityAgentUpgradeable.CallOpts)
}

// GetSystemPrompt is a free data retrieval call binding the contract method 0x07679a64.
//
// Solidity: function getSystemPrompt() view returns(string)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableCallerSession) GetSystemPrompt() (string, error) {
	return _UtilityAgentUpgradeable.Contract.GetSystemPrompt(&_UtilityAgentUpgradeable.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _UtilityAgentUpgradeable.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableSession) Owner() (common.Address, error) {
	return _UtilityAgentUpgradeable.Contract.Owner(&_UtilityAgentUpgradeable.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableCallerSession) Owner() (common.Address, error) {
	return _UtilityAgentUpgradeable.Contract.Owner(&_UtilityAgentUpgradeable.CallOpts)
}

// AddNewStorageInfo is a paid mutator transaction binding the contract method 0x1006c98b.
//
// Solidity: function addNewStorageInfo((address,string) storageInfo) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableTransactor) AddNewStorageInfo(opts *bind.TransactOpts, storageInfo IUtilityAgentStorageInfo) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.contract.Transact(opts, "addNewStorageInfo", storageInfo)
}

// AddNewStorageInfo is a paid mutator transaction binding the contract method 0x1006c98b.
//
// Solidity: function addNewStorageInfo((address,string) storageInfo) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableSession) AddNewStorageInfo(storageInfo IUtilityAgentStorageInfo) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.AddNewStorageInfo(&_UtilityAgentUpgradeable.TransactOpts, storageInfo)
}

// AddNewStorageInfo is a paid mutator transaction binding the contract method 0x1006c98b.
//
// Solidity: function addNewStorageInfo((address,string) storageInfo) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableTransactorSession) AddNewStorageInfo(storageInfo IUtilityAgentStorageInfo) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.AddNewStorageInfo(&_UtilityAgentUpgradeable.TransactOpts, storageInfo)
}

// Initialize is a paid mutator transaction binding the contract method 0x816dea16.
//
// Solidity: function initialize(string systemPrompt_, (address,string)[] storageInfos_) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableTransactor) Initialize(opts *bind.TransactOpts, systemPrompt_ string, storageInfos_ []IUtilityAgentStorageInfo) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.contract.Transact(opts, "initialize", systemPrompt_, storageInfos_)
}

// Initialize is a paid mutator transaction binding the contract method 0x816dea16.
//
// Solidity: function initialize(string systemPrompt_, (address,string)[] storageInfos_) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableSession) Initialize(systemPrompt_ string, storageInfos_ []IUtilityAgentStorageInfo) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.Initialize(&_UtilityAgentUpgradeable.TransactOpts, systemPrompt_, storageInfos_)
}

// Initialize is a paid mutator transaction binding the contract method 0x816dea16.
//
// Solidity: function initialize(string systemPrompt_, (address,string)[] storageInfos_) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableTransactorSession) Initialize(systemPrompt_ string, storageInfos_ []IUtilityAgentStorageInfo) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.Initialize(&_UtilityAgentUpgradeable.TransactOpts, systemPrompt_, storageInfos_)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableSession) RenounceOwnership() (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.RenounceOwnership(&_UtilityAgentUpgradeable.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.RenounceOwnership(&_UtilityAgentUpgradeable.TransactOpts)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.TransferOwnership(&_UtilityAgentUpgradeable.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.TransferOwnership(&_UtilityAgentUpgradeable.TransactOpts, newOwner)
}

// UpdateEndpoint is a paid mutator transaction binding the contract method 0x6cece163.
//
// Solidity: function updateEndpoint(string key, string value) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableTransactor) UpdateEndpoint(opts *bind.TransactOpts, key string, value string) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.contract.Transact(opts, "updateEndpoint", key, value)
}

// UpdateEndpoint is a paid mutator transaction binding the contract method 0x6cece163.
//
// Solidity: function updateEndpoint(string key, string value) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableSession) UpdateEndpoint(key string, value string) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.UpdateEndpoint(&_UtilityAgentUpgradeable.TransactOpts, key, value)
}

// UpdateEndpoint is a paid mutator transaction binding the contract method 0x6cece163.
//
// Solidity: function updateEndpoint(string key, string value) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableTransactorSession) UpdateEndpoint(key string, value string) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.UpdateEndpoint(&_UtilityAgentUpgradeable.TransactOpts, key, value)
}

// UpdateEndpoints is a paid mutator transaction binding the contract method 0xaab24f97.
//
// Solidity: function updateEndpoints(string[] keys, string[] values) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableTransactor) UpdateEndpoints(opts *bind.TransactOpts, keys []string, values []string) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.contract.Transact(opts, "updateEndpoints", keys, values)
}

// UpdateEndpoints is a paid mutator transaction binding the contract method 0xaab24f97.
//
// Solidity: function updateEndpoints(string[] keys, string[] values) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableSession) UpdateEndpoints(keys []string, values []string) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.UpdateEndpoints(&_UtilityAgentUpgradeable.TransactOpts, keys, values)
}

// UpdateEndpoints is a paid mutator transaction binding the contract method 0xaab24f97.
//
// Solidity: function updateEndpoints(string[] keys, string[] values) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableTransactorSession) UpdateEndpoints(keys []string, values []string) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.UpdateEndpoints(&_UtilityAgentUpgradeable.TransactOpts, keys, values)
}

// UpdateStorageInfo is a paid mutator transaction binding the contract method 0xf9be7f6d.
//
// Solidity: function updateStorageInfo(uint256 cfIndex, (address,string) storageInfo) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableTransactor) UpdateStorageInfo(opts *bind.TransactOpts, cfIndex *big.Int, storageInfo IUtilityAgentStorageInfo) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.contract.Transact(opts, "updateStorageInfo", cfIndex, storageInfo)
}

// UpdateStorageInfo is a paid mutator transaction binding the contract method 0xf9be7f6d.
//
// Solidity: function updateStorageInfo(uint256 cfIndex, (address,string) storageInfo) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableSession) UpdateStorageInfo(cfIndex *big.Int, storageInfo IUtilityAgentStorageInfo) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.UpdateStorageInfo(&_UtilityAgentUpgradeable.TransactOpts, cfIndex, storageInfo)
}

// UpdateStorageInfo is a paid mutator transaction binding the contract method 0xf9be7f6d.
//
// Solidity: function updateStorageInfo(uint256 cfIndex, (address,string) storageInfo) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableTransactorSession) UpdateStorageInfo(cfIndex *big.Int, storageInfo IUtilityAgentStorageInfo) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.UpdateStorageInfo(&_UtilityAgentUpgradeable.TransactOpts, cfIndex, storageInfo)
}

// UpdateSystemPrompt is a paid mutator transaction binding the contract method 0x76a30029.
//
// Solidity: function updateSystemPrompt(string systemPrompt) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableTransactor) UpdateSystemPrompt(opts *bind.TransactOpts, systemPrompt string) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.contract.Transact(opts, "updateSystemPrompt", systemPrompt)
}

// UpdateSystemPrompt is a paid mutator transaction binding the contract method 0x76a30029.
//
// Solidity: function updateSystemPrompt(string systemPrompt) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableSession) UpdateSystemPrompt(systemPrompt string) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.UpdateSystemPrompt(&_UtilityAgentUpgradeable.TransactOpts, systemPrompt)
}

// UpdateSystemPrompt is a paid mutator transaction binding the contract method 0x76a30029.
//
// Solidity: function updateSystemPrompt(string systemPrompt) returns()
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableTransactorSession) UpdateSystemPrompt(systemPrompt string) (*types.Transaction, error) {
	return _UtilityAgentUpgradeable.Contract.UpdateSystemPrompt(&_UtilityAgentUpgradeable.TransactOpts, systemPrompt)
}

// UtilityAgentUpgradeableEndpointUpdateIterator is returned from FilterEndpointUpdate and is used to iterate over the raw logs and unpacked data for EndpointUpdate events raised by the UtilityAgentUpgradeable contract.
type UtilityAgentUpgradeableEndpointUpdateIterator struct {
	Event *UtilityAgentUpgradeableEndpointUpdate // Event containing the contract specifics and raw log

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
func (it *UtilityAgentUpgradeableEndpointUpdateIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(UtilityAgentUpgradeableEndpointUpdate)
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
		it.Event = new(UtilityAgentUpgradeableEndpointUpdate)
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
func (it *UtilityAgentUpgradeableEndpointUpdateIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *UtilityAgentUpgradeableEndpointUpdateIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// UtilityAgentUpgradeableEndpointUpdate represents a EndpointUpdate event raised by the UtilityAgentUpgradeable contract.
type UtilityAgentUpgradeableEndpointUpdate struct {
	Key   string
	Value string
	Raw   types.Log // Blockchain specific contextual infos
}

// FilterEndpointUpdate is a free log retrieval operation binding the contract event 0x9db1902c64383c2dd35b70e6329e4511000fe9f53761fa099fd0559951be8370.
//
// Solidity: event EndpointUpdate(string key, string value)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableFilterer) FilterEndpointUpdate(opts *bind.FilterOpts) (*UtilityAgentUpgradeableEndpointUpdateIterator, error) {

	logs, sub, err := _UtilityAgentUpgradeable.contract.FilterLogs(opts, "EndpointUpdate")
	if err != nil {
		return nil, err
	}
	return &UtilityAgentUpgradeableEndpointUpdateIterator{contract: _UtilityAgentUpgradeable.contract, event: "EndpointUpdate", logs: logs, sub: sub}, nil
}

// WatchEndpointUpdate is a free log subscription operation binding the contract event 0x9db1902c64383c2dd35b70e6329e4511000fe9f53761fa099fd0559951be8370.
//
// Solidity: event EndpointUpdate(string key, string value)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableFilterer) WatchEndpointUpdate(opts *bind.WatchOpts, sink chan<- *UtilityAgentUpgradeableEndpointUpdate) (event.Subscription, error) {

	logs, sub, err := _UtilityAgentUpgradeable.contract.WatchLogs(opts, "EndpointUpdate")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(UtilityAgentUpgradeableEndpointUpdate)
				if err := _UtilityAgentUpgradeable.contract.UnpackLog(event, "EndpointUpdate", log); err != nil {
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

// ParseEndpointUpdate is a log parse operation binding the contract event 0x9db1902c64383c2dd35b70e6329e4511000fe9f53761fa099fd0559951be8370.
//
// Solidity: event EndpointUpdate(string key, string value)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableFilterer) ParseEndpointUpdate(log types.Log) (*UtilityAgentUpgradeableEndpointUpdate, error) {
	event := new(UtilityAgentUpgradeableEndpointUpdate)
	if err := _UtilityAgentUpgradeable.contract.UnpackLog(event, "EndpointUpdate", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// UtilityAgentUpgradeableInitializedIterator is returned from FilterInitialized and is used to iterate over the raw logs and unpacked data for Initialized events raised by the UtilityAgentUpgradeable contract.
type UtilityAgentUpgradeableInitializedIterator struct {
	Event *UtilityAgentUpgradeableInitialized // Event containing the contract specifics and raw log

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
func (it *UtilityAgentUpgradeableInitializedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(UtilityAgentUpgradeableInitialized)
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
		it.Event = new(UtilityAgentUpgradeableInitialized)
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
func (it *UtilityAgentUpgradeableInitializedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *UtilityAgentUpgradeableInitializedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// UtilityAgentUpgradeableInitialized represents a Initialized event raised by the UtilityAgentUpgradeable contract.
type UtilityAgentUpgradeableInitialized struct {
	Version uint8
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterInitialized is a free log retrieval operation binding the contract event 0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498.
//
// Solidity: event Initialized(uint8 version)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableFilterer) FilterInitialized(opts *bind.FilterOpts) (*UtilityAgentUpgradeableInitializedIterator, error) {

	logs, sub, err := _UtilityAgentUpgradeable.contract.FilterLogs(opts, "Initialized")
	if err != nil {
		return nil, err
	}
	return &UtilityAgentUpgradeableInitializedIterator{contract: _UtilityAgentUpgradeable.contract, event: "Initialized", logs: logs, sub: sub}, nil
}

// WatchInitialized is a free log subscription operation binding the contract event 0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498.
//
// Solidity: event Initialized(uint8 version)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableFilterer) WatchInitialized(opts *bind.WatchOpts, sink chan<- *UtilityAgentUpgradeableInitialized) (event.Subscription, error) {

	logs, sub, err := _UtilityAgentUpgradeable.contract.WatchLogs(opts, "Initialized")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(UtilityAgentUpgradeableInitialized)
				if err := _UtilityAgentUpgradeable.contract.UnpackLog(event, "Initialized", log); err != nil {
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
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableFilterer) ParseInitialized(log types.Log) (*UtilityAgentUpgradeableInitialized, error) {
	event := new(UtilityAgentUpgradeableInitialized)
	if err := _UtilityAgentUpgradeable.contract.UnpackLog(event, "Initialized", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// UtilityAgentUpgradeableOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the UtilityAgentUpgradeable contract.
type UtilityAgentUpgradeableOwnershipTransferredIterator struct {
	Event *UtilityAgentUpgradeableOwnershipTransferred // Event containing the contract specifics and raw log

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
func (it *UtilityAgentUpgradeableOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(UtilityAgentUpgradeableOwnershipTransferred)
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
		it.Event = new(UtilityAgentUpgradeableOwnershipTransferred)
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
func (it *UtilityAgentUpgradeableOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *UtilityAgentUpgradeableOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// UtilityAgentUpgradeableOwnershipTransferred represents a OwnershipTransferred event raised by the UtilityAgentUpgradeable contract.
type UtilityAgentUpgradeableOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*UtilityAgentUpgradeableOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _UtilityAgentUpgradeable.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &UtilityAgentUpgradeableOwnershipTransferredIterator{contract: _UtilityAgentUpgradeable.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *UtilityAgentUpgradeableOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _UtilityAgentUpgradeable.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(UtilityAgentUpgradeableOwnershipTransferred)
				if err := _UtilityAgentUpgradeable.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
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
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableFilterer) ParseOwnershipTransferred(log types.Log) (*UtilityAgentUpgradeableOwnershipTransferred, error) {
	event := new(UtilityAgentUpgradeableOwnershipTransferred)
	if err := _UtilityAgentUpgradeable.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// UtilityAgentUpgradeableStorageInfoUpdateIterator is returned from FilterStorageInfoUpdate and is used to iterate over the raw logs and unpacked data for StorageInfoUpdate events raised by the UtilityAgentUpgradeable contract.
type UtilityAgentUpgradeableStorageInfoUpdateIterator struct {
	Event *UtilityAgentUpgradeableStorageInfoUpdate // Event containing the contract specifics and raw log

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
func (it *UtilityAgentUpgradeableStorageInfoUpdateIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(UtilityAgentUpgradeableStorageInfoUpdate)
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
		it.Event = new(UtilityAgentUpgradeableStorageInfoUpdate)
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
func (it *UtilityAgentUpgradeableStorageInfoUpdateIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *UtilityAgentUpgradeableStorageInfoUpdateIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// UtilityAgentUpgradeableStorageInfoUpdate represents a StorageInfoUpdate event raised by the UtilityAgentUpgradeable contract.
type UtilityAgentUpgradeableStorageInfoUpdate struct {
	CfIndex *big.Int
	NewInfo IUtilityAgentStorageInfo
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterStorageInfoUpdate is a free log retrieval operation binding the contract event 0x3fe2087e82e481aaf992df5fc081662871648262a7de10078503707a657fa24b.
//
// Solidity: event StorageInfoUpdate(uint256 indexed cfIndex, (address,string) newInfo)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableFilterer) FilterStorageInfoUpdate(opts *bind.FilterOpts, cfIndex []*big.Int) (*UtilityAgentUpgradeableStorageInfoUpdateIterator, error) {

	var cfIndexRule []interface{}
	for _, cfIndexItem := range cfIndex {
		cfIndexRule = append(cfIndexRule, cfIndexItem)
	}

	logs, sub, err := _UtilityAgentUpgradeable.contract.FilterLogs(opts, "StorageInfoUpdate", cfIndexRule)
	if err != nil {
		return nil, err
	}
	return &UtilityAgentUpgradeableStorageInfoUpdateIterator{contract: _UtilityAgentUpgradeable.contract, event: "StorageInfoUpdate", logs: logs, sub: sub}, nil
}

// WatchStorageInfoUpdate is a free log subscription operation binding the contract event 0x3fe2087e82e481aaf992df5fc081662871648262a7de10078503707a657fa24b.
//
// Solidity: event StorageInfoUpdate(uint256 indexed cfIndex, (address,string) newInfo)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableFilterer) WatchStorageInfoUpdate(opts *bind.WatchOpts, sink chan<- *UtilityAgentUpgradeableStorageInfoUpdate, cfIndex []*big.Int) (event.Subscription, error) {

	var cfIndexRule []interface{}
	for _, cfIndexItem := range cfIndex {
		cfIndexRule = append(cfIndexRule, cfIndexItem)
	}

	logs, sub, err := _UtilityAgentUpgradeable.contract.WatchLogs(opts, "StorageInfoUpdate", cfIndexRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(UtilityAgentUpgradeableStorageInfoUpdate)
				if err := _UtilityAgentUpgradeable.contract.UnpackLog(event, "StorageInfoUpdate", log); err != nil {
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

// ParseStorageInfoUpdate is a log parse operation binding the contract event 0x3fe2087e82e481aaf992df5fc081662871648262a7de10078503707a657fa24b.
//
// Solidity: event StorageInfoUpdate(uint256 indexed cfIndex, (address,string) newInfo)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableFilterer) ParseStorageInfoUpdate(log types.Log) (*UtilityAgentUpgradeableStorageInfoUpdate, error) {
	event := new(UtilityAgentUpgradeableStorageInfoUpdate)
	if err := _UtilityAgentUpgradeable.contract.UnpackLog(event, "StorageInfoUpdate", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// UtilityAgentUpgradeableSystemPromptUpdateIterator is returned from FilterSystemPromptUpdate and is used to iterate over the raw logs and unpacked data for SystemPromptUpdate events raised by the UtilityAgentUpgradeable contract.
type UtilityAgentUpgradeableSystemPromptUpdateIterator struct {
	Event *UtilityAgentUpgradeableSystemPromptUpdate // Event containing the contract specifics and raw log

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
func (it *UtilityAgentUpgradeableSystemPromptUpdateIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(UtilityAgentUpgradeableSystemPromptUpdate)
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
		it.Event = new(UtilityAgentUpgradeableSystemPromptUpdate)
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
func (it *UtilityAgentUpgradeableSystemPromptUpdateIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *UtilityAgentUpgradeableSystemPromptUpdateIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// UtilityAgentUpgradeableSystemPromptUpdate represents a SystemPromptUpdate event raised by the UtilityAgentUpgradeable contract.
type UtilityAgentUpgradeableSystemPromptUpdate struct {
	NewSystemPrompt string
	Raw             types.Log // Blockchain specific contextual infos
}

// FilterSystemPromptUpdate is a free log retrieval operation binding the contract event 0xdf5a31f32f865da404304d8e717e689823eab72d259d756d85fc552ef9ac78d8.
//
// Solidity: event SystemPromptUpdate(string newSystemPrompt)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableFilterer) FilterSystemPromptUpdate(opts *bind.FilterOpts) (*UtilityAgentUpgradeableSystemPromptUpdateIterator, error) {

	logs, sub, err := _UtilityAgentUpgradeable.contract.FilterLogs(opts, "SystemPromptUpdate")
	if err != nil {
		return nil, err
	}
	return &UtilityAgentUpgradeableSystemPromptUpdateIterator{contract: _UtilityAgentUpgradeable.contract, event: "SystemPromptUpdate", logs: logs, sub: sub}, nil
}

// WatchSystemPromptUpdate is a free log subscription operation binding the contract event 0xdf5a31f32f865da404304d8e717e689823eab72d259d756d85fc552ef9ac78d8.
//
// Solidity: event SystemPromptUpdate(string newSystemPrompt)
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableFilterer) WatchSystemPromptUpdate(opts *bind.WatchOpts, sink chan<- *UtilityAgentUpgradeableSystemPromptUpdate) (event.Subscription, error) {

	logs, sub, err := _UtilityAgentUpgradeable.contract.WatchLogs(opts, "SystemPromptUpdate")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(UtilityAgentUpgradeableSystemPromptUpdate)
				if err := _UtilityAgentUpgradeable.contract.UnpackLog(event, "SystemPromptUpdate", log); err != nil {
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
func (_UtilityAgentUpgradeable *UtilityAgentUpgradeableFilterer) ParseSystemPromptUpdate(log types.Log) (*UtilityAgentUpgradeableSystemPromptUpdate, error) {
	event := new(UtilityAgentUpgradeableSystemPromptUpdate)
	if err := _UtilityAgentUpgradeable.contract.UnpackLog(event, "SystemPromptUpdate", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
