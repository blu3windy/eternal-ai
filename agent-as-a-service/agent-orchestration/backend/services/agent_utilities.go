package services

import (
	"context"
	"strings"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/daos"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/helpers"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/types/numeric"
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
		if agentInfo.TokenName != "" && agentInfo.TokenSymbol != "" {
			if agentInfo.MintHash == "" {
				switch agentInfo.NetworkID {
				case models.BASE_CHAIN_ID:
					{
						var contractAddress, txHash string
						if contractAddress == "" {
							return errs.NewError(errs.ErrBadRequest)
						}
						err = daos.WithTransaction(daos.GetDBMainCtx(ctx),
							func(tx *gorm.DB) error {
								err = tx.
									Model(agentInfo).
									Updates(
										map[string]interface{}{
											"agent_contract_address": strings.ToLower(contractAddress),
											"mint_hash":              txHash,
											"status":                 models.AssistantStatusMinting,
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
										TokenAddress:      contractAddress,
										Name:              agentInfo.TokenName,
										Description:       agentInfo.TokenDesc,
										Ticker:            agentInfo.TokenSymbol,
										Image:             agentInfo.TokenImageUrl,
										Twitter:           "",
										Telegram:          "",
										Website:           "",
										Status:            models.MemeStatusCreated,
										StoreImageOnChain: false,
										TotalSuply:        numeric.NewBigFloatFromString("1000000000"),
										Supply:            numeric.NewBigFloatFromString("1000000000"),
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
									meme.TokenAddress = contractAddress
									err = s.dao.Save(tx, meme)
									if err != nil {
										return errs.NewError(err)
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
