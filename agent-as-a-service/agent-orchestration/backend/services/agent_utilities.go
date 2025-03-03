package services

import (
	"context"
	"encoding/json"
	"strings"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/daos"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/helpers"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services/3rd/binds/agentupgradeable"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services/3rd/binds/erc20utilityagent"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services/3rd/evmapi"
	"github.com/ethereum/go-ethereum/common"
)

func (s *Service) ERC20UtilityAgentFetchCode(
	ctx context.Context,
	networkID uint64,
	contractAddress string,
) (string, error) {
	resp, err := s.GetEthereumClient(ctx, networkID).
		ERC20UtilityAgentFetchCode(
			contractAddress,
		)
	if err != nil {
		return "", errs.NewError(err)
	}
	return resp, nil
}

func (s *Service) ERC20UtilityAgentGetStorageInfo(
	ctx context.Context,
	networkID uint64,
	contractAddress string,
) (*erc20utilityagent.IUtilityAgentStorageInfo, error) {
	resp, err := s.GetEthereumClient(ctx, networkID).
		ERC20UtilityAgentGetStorageInfo(
			contractAddress,
		)
	if err != nil {
		return nil, errs.NewError(err)
	}
	return resp, nil
}

func (s *Service) DeployAgentUpgradeableAddress(
	ctx context.Context,
	networkID uint64,
	agentName string,
	agentVersion string,
	codeLanguage string,
	pointers []agentupgradeable.IAgentCodePointer,
	depsAgents []common.Address,
	agentOwner common.Address,
	isOnchain bool,
) (string, string, string, error) {
	memePoolAddress := strings.ToLower(s.conf.GetConfigKeyString(networkID, "meme_pool_address"))
	proxyAdminAddress := strings.ToLower(s.conf.GetConfigKeyString(networkID, "proxy_admin_address"))
	logicAddress := strings.ToLower(s.conf.GetConfigKeyString(networkID, "utilityagentupgradeable_address"))
	initializeData, err := evmapi.AgentUpgradeableInitializeData(
		agentName,
		agentVersion,
		codeLanguage,
		pointers,
		depsAgents,
		agentOwner,
		isOnchain,
	)
	if err != nil {
		return "", "", "", errs.NewError(err)
	}
	contractAddress, txHash, err := s.GetEVMClient(ctx, networkID).
		DeployTransparentUpgradeableProxy(
			s.GetAddressPrk(memePoolAddress),
			helpers.HexToAddress(logicAddress),
			helpers.HexToAddress(proxyAdminAddress),
			initializeData,
		)
	if err != nil {
		return "", "", "", errs.NewError(err)
	}
	return contractAddress, logicAddress, txHash, nil
}

func (s *Service) DeployAgentUpgradeable(ctx context.Context, agentInfoID uint) error {
	agentInfo, err := s.dao.FirstAgentInfoByID(
		daos.GetDBMainCtx(ctx),
		agentInfoID,
		map[string][]any{},
		false,
	)
	if err != nil {
		return errs.NewError(err)
	}
	if agentInfo != nil {
		if agentInfo.AgentType != models.AgentInfoAgentTypeUtility {
			return errs.NewError(errs.ErrBadRequest)
		}
		if agentInfo.TokenName != "" && agentInfo.TokenSymbol != "" && agentInfo.SourceUrl != "" {
			if agentInfo.MintHash == "" {
				switch agentInfo.NetworkID {
				case models.BASE_SEPOLIA_CHAIN_ID:
					{
						var fileNames []string
						err = json.Unmarshal([]byte(agentInfo.SourceUrl), &fileNames)
						if err != nil {
							return errs.NewError(err)
						}
						if len(fileNames) == 0 {
							return errs.NewError(errs.ErrBadRequest)
						}
						storageInfos := []agentupgradeable.IAgentCodePointer{}
						for _, fileName := range fileNames {
							if strings.HasPrefix(fileName, "ethfs_") {
								storageInfos = append(storageInfos, agentupgradeable.IAgentCodePointer{
									RetrieveAddress: helpers.HexToAddress(strings.ToLower(s.conf.GetConfigKeyString(agentInfo.NetworkID, "ethfs_address"))),
									FileType:        0,
									FileName:        strings.TrimPrefix(fileName, "ethfs_"),
								})
							} else if strings.HasPrefix(fileName, "ipfs_") {
								storageInfos = append(storageInfos, agentupgradeable.IAgentCodePointer{
									RetrieveAddress: helpers.HexToAddress(models.ETH_ZERO_ADDRESS),
									FileType:        0,
									FileName:        strings.TrimPrefix(fileName, "ipfs_"),
								})
							} else {
								return errs.NewError(errs.ErrBadRequest)
							}
						}
						dependAgentAddrs := []common.Address{}
						if agentInfo.DependAgents != "" {
							var dependAgents []string
							err = json.Unmarshal([]byte(agentInfo.DependAgents), &dependAgents)
							if err != nil {
								return errs.NewError(err)
							}
							for _, v := range dependAgents {
								dependAgentAddrs = append(dependAgentAddrs, helpers.HexToAddress(v))
							}
						}
						contractAddress, logicAddress, txHash, err := s.DeployAgentUpgradeableAddress(
							ctx,
							agentInfo.NetworkID,
							agentInfo.AgentName,
							"1",
							"js",
							storageInfos,
							dependAgentAddrs,
							helpers.HexToAddress(agentInfo.Creator),
							agentInfo.IsOnchain,
						)
						if err != nil {
							return errs.NewError(err)
						}
						err = daos.GetDBMainCtx(ctx).
							Model(agentInfo).
							Updates(
								map[string]any{
									"agent_contract_address": strings.ToLower(contractAddress),
									"agent_logic_address":    strings.ToLower(logicAddress),
									"agent_contract_id":      "0",
									"mint_hash":              txHash,
									"status":                 models.AssistantStatusReady,
									"reply_enabled":          true,
								},
							).Error
						if err != nil {
							return errs.NewError(err)
						}
						if err != nil {
							return errs.NewError(err)
						}
					}
				default:
					{
						return errs.NewError(errs.ErrBadRequest)
					}
				}
			}
		}
	}
	return nil
}
