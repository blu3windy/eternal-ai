package services

import (
	"context"
	"math/big"
	"strings"
	"time"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/daos"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/helpers"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
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
	return robotSaleWallet, nil
}

func (s *Service) JobRobotScanBalanceSOL(ctx context.Context) error {
	err := s.JobRunCheck(
		ctx,
		"JobRobotScanBalanceSOL",
		func() error {
			wallets, err := s.dao.FindAgentInfoJoinSelect(
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
				[]string{"robot_sale_wallets.sol_scan_at asc"}, 1, 50,
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
