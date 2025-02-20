package services

import (
	"context"
	"fmt"
	"strings"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/daos"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/helpers"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/types/numeric"
	"github.com/ethereum/go-ethereum/common"
	"github.com/jinzhu/gorm"
)

func (s *Service) GetAgentStore(ctx context.Context, storeId string) (*models.AgentStore, error) {
	agentStore, err := s.dao.FirstAgentStore(daos.GetDBMainCtx(ctx), map[string][]interface{}{"store_id = ?": {storeId}}, map[string][]interface{}{}, false)
	if err != nil {
		return nil, errs.NewError(err)
	}
	if agentStore == nil {
		return nil, errs.NewError(errs.ErrBadRequest)
	}
	return agentStore, nil
}

func (s *Service) ValidateUserStoreFee(ctx context.Context, apiKey string) (*models.AgentStoreInstall, error) {
	agentStoreInstall, err := s.dao.FirstAgentStoreInstall(
		daos.GetDBMainCtx(ctx),
		map[string][]interface{}{
			"code = ?": {apiKey},
		},
		map[string][]interface{}{
			"User":       {},
			"AgentStore": {},
		},
		[]string{},
	)
	if err != nil {
		return nil, errs.NewError(err)
	}
	if agentStoreInstall == nil {
		return nil, errs.NewError(errs.ErrBadRequest)
	}
	user := agentStoreInstall.User
	agentStore := agentStoreInstall.AgentStore
	if user.EaiBalance.Float.Cmp(&agentStore.Price.Float) < 0 {
		return nil, errs.NewError(errs.ErrInsufficientBalance)
	}
	return agentStoreInstall, nil
}

func (s *Service) ChargeUserStoreInstall(ctx context.Context, agentStoreInstallID uint, urlPath string, status int) error {
	err := daos.WithTransaction(
		daos.GetDBMainCtx(ctx),
		func(tx *gorm.DB) error {
			agentStoreInstall, err := s.dao.FirstAgentStoreInstallByID(
				tx,
				agentStoreInstallID,
				map[string][]interface{}{
					"User":             {},
					"AgentStore.Owner": {},
				},
				false,
			)
			if err != nil {
				return errs.NewError(err)
			}
			if agentStoreInstall == nil {
				return errs.NewError(errs.ErrBadRequest)
			}
			user := agentStoreInstall.User
			agentStoreLog := &models.AgentStoreLog{
				AgentStoreInstallID: agentStoreInstall.ID,
				UserID:              user.ID,
				AgentStoreID:        agentStoreInstall.AgentStoreID,
				Price:               agentStoreInstall.AgentStore.Price,
				UrlPath:             urlPath,
				Status:              status,
			}
			err = s.dao.Create(tx, agentStoreLog)
			if err != nil {
				return errs.NewError(err)
			}
			if agentStoreLog.Status < 300 {
				{
					err = tx.Model(user).
						UpdateColumn("eai_balance", gorm.Expr("eai_balance - ?", agentStoreLog.Price)).
						Error
					if err != nil {
						return errs.NewError(err)
					}
					err = s.dao.Create(
						tx,
						&models.UserTransaction{
							NetworkID: user.NetworkID,
							EventId:   fmt.Sprintf("user_agent_store_log_%d", agentStoreLog.ID),
							UserID:    user.ID,
							Type:      models.UserTransactionTypeUserAgentInfraFee,
							Amount:    numeric.NewBigFloatFromFloat(models.NegativeBigFloat(&agentStoreLog.Price.Float)),
							Status:    models.UserTransactionStatusDone,
						},
					)
					if err != nil {
						return errs.NewError(err)
					}
				}
				{
					owner := agentStoreInstall.AgentStore.Owner
					err = tx.Model(owner).
						UpdateColumn("eai_balance", gorm.Expr("eai_balance + ?", agentStoreLog.Price)).
						Error
					if err != nil {
						return errs.NewError(err)
					}
					err = s.dao.Create(
						tx,
						&models.UserTransaction{
							NetworkID: owner.NetworkID,
							EventId:   fmt.Sprintf("creator_agent_store_log_%d", agentStoreLog.ID),
							UserID:    owner.ID,
							Type:      models.UserTransactionTypeCreatorAgentInfraFee,
							Amount:    agentStoreLog.Price,
							Status:    models.UserTransactionStatusDone,
						},
					)
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
	return nil
}

func (s *Service) ScanAgentInfraMintHash(ctx context.Context, userAddress string, networkID uint64, txHash string, agentStoreID uint) error {
	agentStore, err := s.dao.FirstAgentStoreByID(daos.GetDBMainCtx(ctx), agentStoreID, map[string][]interface{}{}, false)
	if err != nil {
		return errs.NewError(err)
	}
	if agentStore.NetworkID > 0 || agentStore.ContractAddress != "" || agentStore.TokenId > 0 {
		return errs.NewError(errs.ErrBadRequest)
	}
	user, err := s.GetUser(daos.GetDBMainCtx(ctx), 0, userAddress, false)
	if err != nil {
		return errs.NewError(err)
	}
	if agentStore.OwnerID != user.ID {
		return errs.NewError(errs.ErrBadRequest)
	}
	logResp, err := s.GetEthereumClient(ctx, networkID).EventsByTransaction(txHash)
	if err != nil {
		return errs.NewError(err)
	}
	var contractAddress string
	var tokenId uint64
	for _, v := range logResp.NftTransfer {
		if strings.EqualFold(v.From, models.ETH_ZERO_ADDRESS) {
			contractAddress = strings.ToLower(v.ContractAddress)
			tokenId = v.TokenId.Uint64()
			break
		}
	}
	if tokenId <= 0 {
		return errs.NewError(errs.ErrBadRequest)
	}
	{
		agentStoreCheck, err := s.dao.FirstAgentStore(
			daos.GetDBMainCtx(ctx),
			map[string][]interface{}{
				"contract_address = ?": {contractAddress},
				"token_id = ?":         {tokenId},
			},
			map[string][]interface{}{},
			false,
		)
		if err != nil {
			return errs.NewError(err)
		}
		if agentStoreCheck != nil {
			return errs.NewError(errs.ErrBadRequest)
		}
	}
	err = daos.GetDBMainCtx(ctx).
		Model(agentStore).
		Updates(
			map[string]interface{}{
				"contract_address": contractAddress,
				"token_id":         tokenId,
			},
		).Error
	if err != nil {
		return errs.NewError(err)
	}
	return nil
}

func (s *Service) DeployAgentRealWorldAddress(ctx context.Context, agentInfoID uint) error {
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
		if agentInfo.AgentType != models.AgentInfoAgentTypeRealWorld {
			return errs.NewError(errs.ErrBadRequest)
		}
		if agentInfo.TokenName != "" && agentInfo.TokenSymbol != "" && agentInfo.Worker != "" {
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
						eaiTokenAddress := strings.ToLower(s.conf.GetConfigKeyString(agentInfo.NetworkID, "eai_contract_address"))
						contractAddress, txHash, err := s.GetEthereumClient(ctx, agentInfo.NetworkID).
							DeployERC20RealWorldAgent(
								s.GetAddressPrk(memePoolAddress),
								agentInfo.TokenName,
								agentInfo.TokenSymbol,
								models.ConvertBigFloatToWei(&totalSuply.Float, 18),
								common.HexToAddress(memePoolAddress),
								models.ConvertBigFloatToWei(&agentInfo.MinFeeToUse.Float, 18),
								24*3600,
								common.HexToAddress(eaiTokenAddress),
								common.HexToAddress(agentInfo.Worker),
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
