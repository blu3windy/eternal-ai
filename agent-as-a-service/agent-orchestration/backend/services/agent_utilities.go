package services

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/daos"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/helpers"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services/3rd/binds/erc20utilityagent"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services/3rd/binds/utilityagentupgradeable"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services/3rd/evmapi"
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

func (s *Service) DeployAgentUtilityUpgradeableAddress(
	ctx context.Context,
	networkID uint64,
	systemPrompt string,
	storageInfos []utilityagentupgradeable.IUtilityAgentStorageInfo,
) (string, string, string, error) {
	memePoolAddress := strings.ToLower(s.conf.GetConfigKeyString(networkID, "meme_pool_address"))
	proxyAdminAddress := strings.ToLower(s.conf.GetConfigKeyString(networkID, "proxy_admin_address"))
	logicAddress := strings.ToLower(s.conf.GetConfigKeyString(networkID, "utilityagentupgradeable_address"))
	initializeData, err := evmapi.UtilityAgentUpgradeableInitializeData(systemPrompt, storageInfos)
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

func (s *Service) DeployAgentUtilityUpgradeable(ctx context.Context, agentInfoID uint) error {
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
				case models.BASE_CHAIN_ID,
					models.ARBITRUM_CHAIN_ID,
					models.BSC_CHAIN_ID,
					models.APE_CHAIN_ID,
					models.AVALANCHE_C_CHAIN_ID,
					models.CELO_CHAIN_ID:
					{
						var fileNames []string
						err = json.Unmarshal([]byte(agentInfo.SourceUrl), &fileNames)
						if err != nil {
							return errs.NewError(err)
						}
						if len(fileNames) == 0 {
							return errs.NewError(errs.ErrBadRequest)
						}
						storageInfos := []utilityagentupgradeable.IUtilityAgentStorageInfo{}
						for _, fileName := range fileNames {
							if strings.HasPrefix(fileName, "ethfs_") {
								storageInfos = append(storageInfos, utilityagentupgradeable.IUtilityAgentStorageInfo{
									ContractAddress: helpers.HexToAddress(strings.ToLower(s.conf.GetConfigKeyString(agentInfo.NetworkID, "ethfs_address"))),
									Filename:        strings.TrimPrefix(fileName, "ethfs_"),
								})
							} else if strings.HasPrefix(fileName, "ipfs_") {
								storageInfos = append(storageInfos, utilityagentupgradeable.IUtilityAgentStorageInfo{
									ContractAddress: helpers.HexToAddress(models.ETH_ZERO_ADDRESS),
									Filename:        strings.TrimPrefix(fileName, "ipfs_"),
								})
							} else {
								return errs.NewError(errs.ErrBadRequest)
							}
						}
						systemContentHash, err := s.IpfsUploadDataForName(ctx, fmt.Sprintf("%v_%v", agentInfo.AgentID, "system_content"), []byte(agentInfo.SystemPrompt))
						if err != nil {
							return errs.NewError(err)
						}
						contractAddress, logicAddress, txHash, err := s.DeployAgentUtilityUpgradeableAddress(
							ctx,
							agentInfo.NetworkID,
							systemContentHash,
							storageInfos,
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
