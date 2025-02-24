package services

import (
	"context"
	"fmt"
	"math/big"
	"strings"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/daos"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/helpers"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services/3rd/binds/erc20utilityagent"
	"github.com/ethereum/go-ethereum/accounts/abi"
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

func (s *Service) DeployAgentUtilityAddress(
	ctx context.Context,
	networkID uint64,
	tokenName string,
	tokenSymbol string,
	systemPrompt string,
	fsContractAddress string,
	fileName string,
) (string, string, error) {
	memePoolAddress := strings.ToLower(s.conf.GetConfigKeyString(networkID, "meme_pool_address"))
	typeAddress, err := abi.NewType("address", "", nil)
	if err != nil {
		return "", "", errs.NewError(err)
	}
	typeString, err := abi.NewType("string", "", nil)
	if err != nil {
		return "", "", errs.NewError(err)
	}
	storageInfoArgs := abi.Arguments{
		{Type: typeAddress},
		{Type: typeString},
	}
	storageInfo, err := storageInfoArgs.Pack(
		helpers.HexToAddress(fsContractAddress),
		fileName,
	)
	if err != nil {
		return "", "", errs.NewError(err)
	}
	contractAddress, txHash, err := s.GetEthereumClient(ctx, networkID).
		DeployERC20UtilityAgent(
			s.GetAddressPrk(memePoolAddress),
			tokenName,
			tokenSymbol,
			big.NewInt(0),
			helpers.HexToAddress(memePoolAddress),
			systemPrompt,
			storageInfo,
		)
	if err != nil {
		return "", "", errs.NewError(err)
	}
	return contractAddress, txHash, nil
}

func (s *Service) DeployAgentUtility(ctx context.Context, agentInfoID uint) error {
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
		err = s.CreateTokenInfo(ctx, agentInfo.ID)
		if err != nil {
			return errs.NewError(err)
		}
		agentInfo, err = s.dao.FirstAgentInfoByID(
			daos.GetDBMainCtx(ctx),
			agentInfoID,
			map[string][]any{},
			false,
		)
		if err != nil {
			return errs.NewError(err)
		}
		if agentInfo.TokenName != "" && agentInfo.TokenSymbol != "" && agentInfo.SourceUrl != "" {
			if agentInfo.MintHash == "" {
				switch agentInfo.NetworkID {
				case models.BASE_CHAIN_ID,
					models.ARBITRUM_CHAIN_ID,
					models.BSC_CHAIN_ID,
					models.APE_CHAIN_ID,
					models.AVALANCHE_C_CHAIN_ID:
					{
						var fsContractAddress, fileName string
						if strings.HasPrefix(agentInfo.SourceUrl, "ethfs_") {
							fsContractAddress = strings.ToLower(s.conf.GetConfigKeyString(agentInfo.NetworkID, "ethfs_address"))
							fileName = strings.TrimPrefix(agentInfo.SourceUrl, "ethfs_")
						} else if strings.HasPrefix(agentInfo.SourceUrl, "ipfs_") {
							fsContractAddress = models.ETH_ZERO_ADDRESS
							fileName = strings.TrimPrefix(agentInfo.SourceUrl, "ipfs_")
						} else {
							return errs.NewError(errs.ErrBadRequest)
						}
						systemContentHash, err := s.IpfsUploadDataForName(ctx, fmt.Sprintf("%v_%v", agentInfo.AgentID, "system_content"), []byte(agentInfo.SystemPrompt))
						if err != nil {
							return errs.NewError(err)
						}
						contractAddress, txHash, err := s.DeployAgentUtilityAddress(
							ctx,
							agentInfo.NetworkID,
							agentInfo.TokenName,
							agentInfo.TokenSymbol,
							systemContentHash,
							fsContractAddress,
							fileName,
						)
						if err != nil {
							return errs.NewError(err)
						}
						err = daos.GetDBMainCtx(ctx).
							Model(agentInfo).
							Updates(
								map[string]any{
									"agent_contract_address": strings.ToLower(contractAddress),
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
