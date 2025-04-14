package services

import (
	"context"
	"strings"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/daos"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
)

func (s *Service) AddVibeWhiteList(ctx context.Context, email string) error {
	whiteList := &models.VibeWhiteList{
		Email: email,
	}
	return s.dao.Create(daos.GetDBMainCtx(ctx), whiteList)
}

func (s *Service) ValidateReferralCode(ctx context.Context, refCode, userAddress string) (bool, error) {
	//check if refCode is valid
	vibeRefcode, err := s.dao.FirstVibeReferralCode(daos.GetDBMainCtx(ctx),
		map[string][]interface{}{"ref_code = ?": {refCode}},
		nil, nil)
	if err != nil {
		return false, errs.NewError(err)
	}

	if vibeRefcode == nil {
		return false, errs.NewError(errs.ErrBadRequest)
	}

	if vibeRefcode.Used && !strings.EqualFold(vibeRefcode.UserAddress, userAddress) {
		return false, errs.NewError(errs.ErrReferralCodeUsed)
	}

	vibeRefcode, _ = s.dao.FirstVibeReferralCodeByID(daos.GetDBMainCtx(ctx), vibeRefcode.ID, nil, true)
	vibeRefcode.Used = true
	vibeRefcode.UserAddress = strings.ToLower(userAddress)
	err = s.dao.Save(daos.GetDBMainCtx(ctx), vibeRefcode)
	if err != nil {
		return false, errs.NewError(err)
	}

	return true, nil
}
