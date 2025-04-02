package services

import (
	"context"
	"fmt"
	"math/big"
	"strings"
	"time"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/daos"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/helpers"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/serializers"
	blockchainutils "github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services/3rd/blockchain_utils"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/types/numeric"
	"github.com/jinzhu/gorm"
)

func (s *Service) GenerateRobotSaleWallet(ctx context.Context, projectID string, userAddress string) (*models.RobotSaleWallet, error) {
	var robotSaleWallet *models.RobotSaleWallet
	err := daos.WithTransaction(
		daos.GetDBMainCtx(ctx),
		func(tx *gorm.DB) error {
			userAddress = strings.ToLower(userAddress)
			var err error
			robotSaleWallet, err = s.dao.FirstRobotSaleWallet(tx, map[string][]interface{}{
				"project_id = ?":   {projectID},
				"user_address = ?": {userAddress},
			}, nil, nil)
			if err != nil {
				return errs.NewError(errs.ErrInternalServerError)
			}

			if robotSaleWallet == nil {
				solAddress, err := s.CreateSOLAddress(ctx)
				if err != nil {
					return errs.NewError(err)
				}
				robotSaleWallet = &models.RobotSaleWallet{
					ProjectID:    projectID,
					UserAddress:  userAddress,
					SOLAddress:   solAddress,
					SOLRequestAt: helpers.TimeNow(),
					SOLScanAt:    helpers.TimeNow(),
				}
				err = s.dao.Create(tx, robotSaleWallet)
				if err != nil {
					return errs.NewError(err)
				}

				//create robot project
				robotProject, err := s.dao.FirstRobotProject(tx, map[string][]interface{}{
					"project_id = ?": {projectID},
				}, nil, nil)
				if err != nil {
					return errs.NewError(err)
				}

				if robotProject == nil {
					robotProject = &models.RobotProject{
						ProjectID:   projectID,
						ScanEnabled: true,
					}
					err = s.dao.Create(tx, robotProject)
					if err != nil {
						return errs.NewError(err)
					}
				}
			}
			return nil
		},
	)
	if err != nil {
		return nil, errs.NewError(err)
	}
	return robotSaleWallet, nil
}

func (s *Service) GetRobotSaleWallet(ctx context.Context, projectID string, userAddress string) (*models.RobotSaleWallet, error) {
	userAddress = strings.ToLower(userAddress)
	robotSaleWallet, err := s.dao.FirstRobotSaleWallet(daos.GetDBMainCtx(ctx), map[string][]interface{}{
		"project_id = ?":   {projectID},
		"user_address = ?": {userAddress},
	}, nil, nil)
	if err != nil {
		return nil, errs.NewError(err)
	}
	if robotSaleWallet != nil && robotSaleWallet.SOLScanAt.Before(time.Now().Add(-15*time.Minute)) {
		go s.RobotScanBalanceByWallet(ctx, robotSaleWallet.ID)
	}
	return robotSaleWallet, nil
}

func (s *Service) GetRobotProject(ctx context.Context, projectID string) (*models.RobotProject, error) {
	robotProject, err := s.dao.FirstRobotProject(daos.GetDBMainCtx(ctx), map[string][]interface{}{
		"project_id = ?": {projectID},
	}, nil, nil)
	if err != nil {
		return nil, errs.NewError(err)
	}
	return robotProject, nil
}

func (s *Service) JobRobotScanBalanceSOL(ctx context.Context) error {
	err := s.JobRunCheck(
		ctx,
		"JobRobotScanBalanceSOL",
		func() error {
			wallets, err := s.dao.FindRobotSaleWalletJoinSelect(
				daos.GetDBMainCtx(ctx),
				[]string{"robot_sale_wallets.*"},
				map[string][]interface{}{
					"JOIN robot_projects ON robot_projects.project_id = robot_sale_wallets.project_id": {},
				},
				map[string][]interface{}{
					"robot_projects.scan_enabled = ?":        {true},
					"robot_sale_wallets.sol_request_at >= ?": {time.Now().Add(-6 * time.Hour)},
				},
				map[string][]any{},
				[]string{"robot_sale_wallets.sol_scan_at asc"}, 1, 100,
			)
			if err != nil {
				return errs.NewError(err)
			}
			var retErr error
			for _, wallet := range wallets {
				err = s.RobotScanBalanceByWallet(ctx, wallet.ID)
				if err != nil {
					retErr = errs.MergeError(retErr, errs.NewErrorWithId(err, wallet.ID))
				}
			}
			return retErr
		},
	)
	if err != nil {
		return errs.NewError(err)
	}
	return nil
}

func (s *Service) RobotScanBalanceByWallet(ctx context.Context, walletId uint) error {
	saleWallet, err := s.dao.FirstRobotSaleWalletByID(
		daos.GetDBMainCtx(ctx),
		walletId,
		map[string][]interface{}{},
		false,
	)
	if err != nil {
		return errs.NewError(err)
	}
	if saleWallet.IsSOLTransferring {
		return errs.NewError(errs.ErrBadRequest)
	}
	solBalance, err := s.blockchainUtils.SolanaBalance(saleWallet.SOLAddress)
	if err != nil {
		return errs.NewError(err)
	}
	walletBalance := big.NewInt(int64(solBalance))
	if walletBalance.Cmp(models.ConvertBigFloatToWei(&saleWallet.SOLOnchainBalance.Float, 9)) != 0 {
		err = daos.WithTransaction(
			daos.GetDBMainCtx(ctx),
			func(tx *gorm.DB) error {
				saleWallet, err := s.dao.FirstRobotSaleWalletByID(
					tx,
					saleWallet.ID,
					map[string][]interface{}{},
					true,
				)
				if err != nil {
					return errs.NewError(err)
				}
				if saleWallet.IsSOLTransferring {
					return errs.NewError(errs.ErrBadRequest)
				}
				if walletBalance.Cmp(models.ConvertBigFloatToWei(&saleWallet.SOLOnchainBalance.Float, 9)) != 0 {
					err = tx.
						Model(saleWallet).
						Updates(
							map[string]interface{}{
								"sol_onchain_balance": numeric.NewBigFloatFromFloat(models.ConvertWeiToBigFloat(walletBalance, 9)),
								"sol_balance": numeric.NewBigFloatFromFloat(
									models.AddBigFloats(
										&saleWallet.SOLMovedBalance.Float,
										models.ConvertWeiToBigFloat(walletBalance, 9),
									),
								),
							},
						).Error
					if err != nil {
						return errs.NewError(err)
					}

					err = s.dao.UpdatePrijectTotalBalance(tx, saleWallet.ProjectID)
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

		//TODO: notify change balance
	}
	err = daos.GetDBMainCtx(ctx).
		Model(saleWallet).
		Updates(
			map[string]interface{}{
				"sol_scan_at": time.Now(),
			},
		).Error
	if err != nil {
		return errs.NewError(err)
	}
	return nil
}

func (s *Service) RobotCreateToken(ctx context.Context, projectID string, req *blockchainutils.SolanaCreateTokenReq) (*models.RobotProject, error) {
	var robotProject *models.RobotProject
	err := daos.WithTransaction(
		daos.GetDBMainCtx(ctx),
		func(tx *gorm.DB) error {
			var err error
			robotProject, err = s.dao.FirstRobotProject(tx, map[string][]interface{}{
				"project_id = ?": {projectID},
			}, nil, nil)
			if err != nil {
				return errs.NewError(err)
			}

			if req.Amount == 0 {
				return errs.NewError(errs.ErrBadRequest)
			}

			if robotProject != nil && robotProject.TokenAddress == "" {
				robotProject, _ = s.dao.FirstRobotProjectByID(tx, robotProject.ID, map[string][]interface{}{}, true)
				req.Address = s.conf.Robot.TokenAdminAddress
				if req.Amount == 0 {
					req.Amount = s.conf.Robot.TokenSupply
				}

				if req.Name != "" && req.Symbol != "" {
					robotProject.TokenSymbol = req.Symbol
					robotProject.TokenName = req.Name
				} else if req.Description != "" {
					tokenInfo, _ := s.GenerateTokenInfoFromVideoPrompt(ctx, req.Description, true)
					if tokenInfo != nil && tokenInfo.TokenSymbol != "" {

						robotProject.TokenSymbol = tokenInfo.TokenSymbol
						robotProject.TokenName = tokenInfo.TokenName
						robotProject.TokenImageUrl = tokenInfo.TokenImageUrl

						req.Name = tokenInfo.TokenName
						req.Symbol = tokenInfo.TokenSymbol
					}
				}

				solanaCreateTokenResp, err := s.blockchainUtils.SolanaCreateToken(req)
				if err != nil {
					return errs.NewError(err)
				}

				robotProject.TokenAddress = solanaCreateTokenResp.Mint
				robotProject.TokenSupply = numeric.NewBigFloatFromFloat(big.NewFloat(float64(req.Amount)))
				robotProject.MintHash = solanaCreateTokenResp.Mint
				robotProject.Signature = fmt.Sprintf("%v", solanaCreateTokenResp.Signature)

				err = s.dao.Save(tx, robotProject)
				if err != nil {
					return errs.NewError(err)
				}
			}
			return nil
		},
	)

	if err != nil {
		return nil, errs.NewError(err)
	}

	return robotProject, nil
}

func (s *Service) RobotTransferToken(ctx context.Context, req *serializers.RobotTokenTransferReq) (*models.RobotTokenTransfer, error) {
	var transfer *models.RobotTokenTransfer
	err := daos.WithTransaction(
		daos.GetDBMainCtx(ctx),
		func(tx *gorm.DB) error {
			robotProject, err := s.dao.FirstRobotProject(tx,
				map[string][]interface{}{
					"project_id = ?": {req.ProjectID},
				}, nil, nil)
			if err != nil {
				return errs.NewError(err)
			}

			if robotProject == nil {
				return errs.NewError(errs.ErrBadRequest)
			}

			transfer = &models.RobotTokenTransfer{
				ProjectID:       req.ProjectID,
				ReceiverAddress: req.ReceiverAddress,
				Amount:          numeric.NewBigFloatFromFloat(big.NewFloat(req.Amount)),
				TransferAt:      helpers.TimeNow(),
				Status:          "pending",
			}

			transferResp, err := s.blockchainUtils.SolanaTransfer(s.conf.Robot.TokenAdminAddress, &blockchainutils.SolanaTransferReq{
				ToAddress: req.ReceiverAddress,
				Mint:      robotProject.TokenAddress,
				Amount:    req.Amount,
			})

			if err != nil {
				transfer.Status = "failed"
				transfer.Error = err.Error()
			} else {
				transfer.Status = "success"
				transfer.TxHash = transferResp
			}

			err = s.dao.Create(tx, transfer)
			if err != nil {
				return errs.NewError(err)
			}

			return nil
		},
	)
	if err != nil {
		return nil, errs.NewError(err)
	}
	return transfer, nil
}
