package services

import (
	"context"
	"strings"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/daos"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/helpers"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/types/numeric"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jinzhu/gorm"
)

func (s *Service) DeployAgentUtilityAddress(ctx context.Context, agentInfoID uint) error {
	agentInfo, err := s.dao.FirstAgentInfoByID(
		daos.GetDBMainCtx(ctx),
		agentInfoID,
		map[string][]interface{}{},
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
					models.AVALANCHE_C_CHAIN_ID:
					{
						totalSuply := numeric.NewBigFloatFromString("1000000000")
						memePoolAddress := strings.ToLower(s.conf.GetConfigKeyString(agentInfo.NetworkID, "meme_pool_address"))
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
						record := struct {
							FsContractAddress common.Address
							Filename          string
						}{
							helpers.HexToAddress(fsContractAddress),
							fileName,
						}
						storageInfoType, _ := abi.NewType("tuple", "storageInfo", []abi.ArgumentMarshaling{
							{Name: "fsContractAddress", Type: "address"},
							{Name: "filename", Type: "string"},
						})
						storageInfoArgs := abi.Arguments{
							{Type: storageInfoType, Name: "param"},
						}
						storageInfo, err := storageInfoArgs.Pack(&record)
						if err != nil {
							return errs.NewError(err)
						}
						contractAddress, txHash, err := s.GetEthereumClient(ctx, agentInfo.NetworkID).
							DeployERC20UtilityAgent(
								s.GetAddressPrk(memePoolAddress),
								agentInfo.TokenName,
								agentInfo.TokenSymbol,
								models.ConvertBigFloatToWei(&totalSuply.Float, 18),
								helpers.HexToAddress(memePoolAddress),
								agentInfo.SystemPrompt,
								storageInfo,
							)
						if err != nil {
							return errs.NewError(err)
						}
						err = daos.WithTransaction(daos.GetDBMainCtx(ctx),
							func(tx *gorm.DB) error {
								err = tx.
									Model(agentInfo).
									Updates(
										map[string]interface{}{
											"agent_contract_address": strings.ToLower(contractAddress),
											"mint_hash":              txHash,
											"status":                 models.AssistantStatusReady,
											"reply_enabled":          true,
										},
									).Error
								if err != nil {
									return errs.NewError(err)
								}
								meme, err := s.dao.FirstMeme(tx,
									map[string][]interface{}{
										"agent_info_id = ?": {agentInfo.ID},
									},
									map[string][]interface{}{},
									false,
								)
								if err != nil {
									return errs.NewError(err)
								}
								if meme == nil {
									owner, err := s.GetUser(tx, agentInfo.NetworkID, agentInfo.Creator, false)
									if err != nil {
										return errs.NewError(err)
									}
									meme = &models.Meme{
										NetworkID:         agentInfo.NetworkID,
										OwnerAddress:      strings.ToLower(agentInfo.Creator),
										TokenAddress:      strings.ToLower(contractAddress),
										Name:              agentInfo.TokenName,
										Description:       agentInfo.TokenDesc,
										Ticker:            agentInfo.TokenSymbol,
										Image:             agentInfo.TokenImageUrl,
										Twitter:           "",
										Telegram:          "",
										Website:           "",
										Status:            models.MemeStatusCreated,
										StoreImageOnChain: false,
										TotalSuply:        totalSuply,
										Supply:            totalSuply,
										Decimals:          18,
										AgentInfoID:       agentInfo.ID,
										BaseTokenSymbol:   string(models.BaseTokenSymbolEAI),
										ReqSyncAt:         helpers.TimeNow(),
										SyncAt:            helpers.TimeNow(),
										TokenId:           helpers.RandomBigInt(32).String(),
										OwnerID:           owner.ID,
									}
									err = s.dao.Create(tx, meme)
									if err != nil {
										return errs.NewError(err)
									}
								} else {
									if meme.Status == models.MemeStatusCreated {
										meme.TokenAddress = contractAddress
										err = s.dao.Save(tx, meme)
										if err != nil {
											return errs.NewError(err)
										}
									}
								}
								return nil
							},
						)
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
