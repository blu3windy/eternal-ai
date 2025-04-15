package services

import (
	"context"
	"encoding/json"
	"strings"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/daos"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/helpers"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services/3rd/binds/agentfactory"
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
) (string, string, string, error) {
	memePoolAddress := strings.ToLower(s.conf.GetConfigKeyString(networkID, "meme_pool_address"))
	proxyAdminAddress := strings.ToLower(s.conf.GetConfigKeyString(networkID, "proxy_admin_address"))
	logicAddress := strings.ToLower(s.conf.GetConfigKeyString(networkID, "agentupgradeable_address"))
	registrarAddress := strings.ToLower(s.conf.GetConfigKeyString(networkID, "registrar_address"))
	resolverAddress := strings.ToLower(s.conf.GetConfigKeyString(networkID, "resolver_address"))
	initializeData, err := evmapi.AgentUpgradeableInitializeData(
		agentName,
		agentVersion,
		codeLanguage,
		pointers,
		depsAgents,
		agentOwner,
		common.HexToAddress(registrarAddress),
		common.HexToAddress(resolverAddress),
		10*365*24*60*60,
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

func (s *Service) UpgradeAgentUpgradeable(ctx context.Context, agentInfoID uint) (string, error) {
	agentInfo, err := s.dao.FirstAgentInfoByID(
		daos.GetDBMainCtx(ctx),
		agentInfoID,
		map[string][]any{},
		false,
	)
	if err != nil {
		return "", errs.NewError(err)
	}
	if agentInfo.AgentType != models.AgentInfoAgentTypeModel &&
		agentInfo.AgentType != models.AgentInfoAgentTypeModelOnline &&
		agentInfo.AgentType != models.AgentInfoAgentTypeJs &&
		agentInfo.AgentType != models.AgentInfoAgentTypeInfa &&
		agentInfo.AgentType != models.AgentInfoAgentTypePython &&
		agentInfo.AgentType != models.AgentInfoAgentTypeCustomUi &&
		agentInfo.AgentType != models.AgentInfoAgentTypeCustomPrompt {
		return "", errs.NewError(errs.ErrBadRequest)
	}
	logicAddress := strings.ToLower(s.conf.GetConfigKeyString(agentInfo.NetworkID, "agentupgradeable_address"))
	if !strings.EqualFold(agentInfo.AgentLogicAddress, logicAddress) {
		txHash, err := s.GetEthereumClient(context.Background(), agentInfo.NetworkID).
			ProxyAdminUpgrade(
				s.conf.GetConfigKeyString(agentInfo.NetworkID, "proxy_admin_address"),
				s.GetAddressPrk(s.conf.GetConfigKeyString(agentInfo.NetworkID, "meme_pool_address")),
				helpers.HexToAddress(agentInfo.AgentContractAddress),
				helpers.HexToAddress(logicAddress),
			)
		if err != nil {
			return "", errs.NewError(err)
		}
		err = daos.GetDBMainCtx(ctx).
			Model(agentInfo).
			Updates(
				map[string]any{
					"agent_logic_address": strings.ToLower(logicAddress),
				},
			).Error
		if err != nil {
			return "", errs.NewError(err)
		}
		return txHash, nil
	}
	return "", nil
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
		if agentInfo.AgentType != models.AgentInfoAgentTypeModel &&
			agentInfo.AgentType != models.AgentInfoAgentTypeModelOnline &&
			agentInfo.AgentType != models.AgentInfoAgentTypeInfa &&
			agentInfo.AgentType != models.AgentInfoAgentTypeJs &&
			agentInfo.AgentType != models.AgentInfoAgentTypePython &&
			agentInfo.AgentType != models.AgentInfoAgentTypeCustomUi &&
			agentInfo.AgentType != models.AgentInfoAgentTypeCustomPrompt {
			return errs.NewError(errs.ErrBadRequest)
		}
		if agentInfo.MintHash == "" {
			switch agentInfo.NetworkID {
			case models.ETHEREUM_CHAIN_ID,
				models.BITTENSOR_CHAIN_ID,
				models.BASE_CHAIN_ID,
				models.HERMES_CHAIN_ID,
				models.ARBITRUM_CHAIN_ID,
				models.ZKSYNC_CHAIN_ID,
				models.POLYGON_CHAIN_ID,
				models.BSC_CHAIN_ID,
				models.APE_CHAIN_ID,
				models.AVALANCHE_C_CHAIN_ID,
				models.ABSTRACT_TESTNET_CHAIN_ID,
				models.DUCK_CHAIN_ID,
				models.MODE_CHAIN_ID,
				models.ZETA_CHAIN_ID,
				models.STORY_CHAIN_ID,
				models.HYPE_CHAIN_ID,
				models.MONAD_TESTNET_CHAIN_ID,
				models.MEGAETH_TESTNET_CHAIN_ID,
				models.CELO_CHAIN_ID,
				models.BASE_SEPOLIA_CHAIN_ID:
				{
					if agentInfo.SourceUrl == "" {
						return errs.NewError(errs.ErrBadRequest)
					}
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
							storageInfos = append(storageInfos, agentupgradeable.IAgentCodePointer{
								RetrieveAddress: helpers.HexToAddress(models.ETH_ZERO_ADDRESS),
								FileType:        0,
								FileName:        fileName,
							})
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
					var codeLanguage string
					switch agentInfo.AgentType {
					case models.AgentInfoAgentTypeJs,
						models.AgentInfoAgentTypeInfa:
						{
							codeLanguage = "javascript"
						}
					case models.AgentInfoAgentTypePython:
						{
							codeLanguage = "python"
							if agentInfo.IsCustomUi {
								codeLanguage = "python_custom_ui"
							}
						}
					case models.AgentInfoAgentTypeModel:
						{
							codeLanguage = "model"
						}
					case models.AgentInfoAgentTypeModelOnline:
						{
							codeLanguage = "model_online"
						}
					case models.AgentInfoAgentTypeCustomUi:
						{
							codeLanguage = "custom_ui"
						}
					case models.AgentInfoAgentTypeCustomPrompt:
						{
							codeLanguage = "custom_prompt"
						}
					}
					contractAddress, logicAddress, txHash, err := s.DeployAgentUpgradeableAddress(
						ctx,
						agentInfo.NetworkID,
						agentInfo.AgentName,
						"1",
						codeLanguage,
						storageInfos,
						dependAgentAddrs,
						helpers.HexToAddress(agentInfo.Creator),
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
				}
			default:
				{
					return errs.NewError(errs.ErrBadRequest)
				}
			}
		}
	}
	return nil
}

func (s *Service) JobUpdateAgentUpgradeableCodeVersion(ctx context.Context) error {
	agents, err := s.dao.FindAgentInfo(
		daos.GetDBMainCtx(ctx),
		map[string][]any{
			"agent_contract_address != ?": {""},
			"agent_type in (?)": {
				[]models.AgentInfoAgentType{
					models.AgentInfoAgentTypeModel,
					models.AgentInfoAgentTypeModelOnline,
					models.AgentInfoAgentTypeJs,
					models.AgentInfoAgentTypePython,
					models.AgentInfoAgentTypeInfa,
					models.AgentInfoAgentTypeCustomUi,
					models.AgentInfoAgentTypeCustomPrompt,
				},
			},
			"network_id in (?)": {
				[]uint64{
					models.SHARDAI_CHAIN_ID,
					models.ETHEREUM_CHAIN_ID,
					models.BITTENSOR_CHAIN_ID,
					models.BASE_CHAIN_ID,
					models.HERMES_CHAIN_ID,
					models.ARBITRUM_CHAIN_ID,
					models.ZKSYNC_CHAIN_ID,
					models.POLYGON_CHAIN_ID,
					models.BSC_CHAIN_ID,
					models.APE_CHAIN_ID,
					models.AVALANCHE_C_CHAIN_ID,
					models.ABSTRACT_TESTNET_CHAIN_ID,
					models.DUCK_CHAIN_ID,
					models.TRON_CHAIN_ID,
					models.MODE_CHAIN_ID,
					models.ZETA_CHAIN_ID,
					models.STORY_CHAIN_ID,
					models.HYPE_CHAIN_ID,
					models.MONAD_TESTNET_CHAIN_ID,
					models.MEGAETH_TESTNET_CHAIN_ID,
					models.CELO_CHAIN_ID,
					models.BASE_SEPOLIA_CHAIN_ID,
				},
			},
		},
		map[string][]any{},
		[]string{},
		0,
		999999,
	)
	if err != nil {
		return errs.NewError(err)
	}
	for _, agent := range agents {
		err = s.UpdateAgentUpgradeableCodeVersion(ctx, agent.ID)
		if err != nil {
			return errs.NewError(err)
		}
	}
	return nil
}

func (s *Service) HandleAgentUpgradeableCodePointerCreated(ctx context.Context, event *agentupgradeable.AgentUpgradeableCodePointerCreated) error {
	agentInfo, err := s.dao.FirstAgentInfo(
		daos.GetDBMainCtx(ctx),
		map[string][]any{
			"agent_contract_address = ?": {event.Raw.Address.Hex()},
		},
		map[string][]any{},
		[]string{},
	)
	if err != nil {
		return errs.NewError(err)
	}
	if agentInfo != nil {
		err = s.UpdateAgentUpgradeableCodeVersion(ctx, agentInfo.ID)
		if err != nil {
			return errs.NewError(err)
		}
	}
	return nil
}

func (s *Service) UpdateAgentUpgradeableCodeVersion(ctx context.Context, agentInfoID uint) error {
	agentInfo, err := s.dao.FirstAgentInfoByID(
		daos.GetDBMainCtx(ctx),
		agentInfoID,
		map[string][]any{},
		false,
	)
	if err != nil {
		return errs.NewError(err)
	}
	if agentInfo.AgentContractAddress == "" ||
		agentInfo.AgentContractID != "0" {
		return errs.NewError(errs.ErrBadRequest)
	}
	codeVersion, err := s.GetEthereumClient(ctx, agentInfo.NetworkID).AgentUpgradeableCodeVersion(agentInfo.AgentContractAddress)
	if err != nil {
		return errs.NewError(err)
	}
	depsAgents, err := s.GetEthereumClient(ctx, agentInfo.NetworkID).AgentUpgradeableDepsAgents(agentInfo.AgentContractAddress, codeVersion)
	if err != nil {
		return errs.NewError(err)
	}
	depsAgentsBytes, err := json.Marshal(depsAgents)
	if err != nil {
		return errs.NewError(err)
	}
	depsAgentsJson := strings.ToLower(string(depsAgentsBytes))
	if codeVersion != agentInfo.CodeVersion || !strings.EqualFold(depsAgentsJson, agentInfo.DependAgents) {
		err = daos.GetDBMainCtx(ctx).
			Model(agentInfo).
			Updates(
				map[string]any{
					"code_version":  codeVersion,
					"depend_agents": depsAgentsJson,
				},
			).Error
		if err != nil {
			return errs.NewError(err)
		}
	}
	return nil
}

func (s *Service) AgentFactoryAgentCreatedEvent(ctx context.Context, networkID uint64, event *agentfactory.AgentFactoryAgentCreated) error {
	agentFactoryAddress := strings.ToLower(s.conf.GetConfigKeyString(networkID, "agent_factory_address"))
	if strings.EqualFold(agentFactoryAddress, event.Raw.Address.Hex()) {
		agentID := common.Bytes2Hex(event.AgentId[:])
		agentInfo, err := s.dao.FirstAgentInfo(
			daos.GetDBMainCtx(ctx),
			map[string][]any{
				"agent_id": {agentID},
			},
			map[string][]any{},
			[]string{},
		)
		if err != nil {
			return errs.NewError(err)
		}
		if agentInfo != nil && agentInfo.AgentContractAddress == "" {
			agentAddress := strings.ToLower(event.Agent.Hex())
			err = daos.GetDBMainCtx(ctx).
				Model(agentInfo).
				Updates(
					map[string]any{
						"agent_contract_address": agentAddress,
						"agent_contract_id":      "0",
						"mint_hash":              event.Raw.TxHash.Hex(),
						"status":                 models.AssistantStatusReady,
						"reply_enabled":          true,
						"agent_nft_minted":       true,
					},
				).Error
			if err != nil {
				return errs.NewError(err)
			}
			go s.UpdateAgentUpgradeableCodeVersion(ctx, agentInfo.ID)
		}
	}
	return nil
}
