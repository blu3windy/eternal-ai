package services

import (
	"context"
	"encoding/base64"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/daos"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/helpers"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
)

func (s *Service) StoreDefiAppAuthenInstall(ctx context.Context, installUri string, installCode string) (string, error) {
	if installCode == "" {
		return "", errs.NewError(errs.ErrBadRequest)
	}
	apiKey, solAddress, err := func() (string, string, error) {
		storeDefiApp, err := s.dao.FirstStoreDefiApp(
			daos.GetDBMainCtx(ctx),
			map[string][]interface{}{
				"install_code = ?": {installCode},
			},
			map[string][]interface{}{}, []string{},
		)
		if err != nil {
			return "", "", errs.NewError(err)
		}
		if storeDefiApp == nil {
			solAddress, err := s.CreateSOLAddress(ctx)
			if err != nil {
				return "", "", errs.NewError(err)
			}
			storeDefiApp = &models.StoreDefiApp{
				InstallCode: installCode,
				ApiKey:      helpers.RandomStringWithLength(64),
				SolAddress:  solAddress,
			}
			err = s.dao.Create(daos.GetDBMainCtx(ctx), storeDefiApp)
			if err != nil {
				return "", "", errs.NewError(err)
			}
		}
		return storeDefiApp.ApiKey, storeDefiApp.SolAddress, nil
	}()
	if err != nil {
		return helpers.BuildUri(
			installUri,
			map[string]string{
				"install_code": installCode,
				"error":        err.Error(),
			},
		), nil
	}
	params := map[string]string{
		"api_key":     apiKey,
		"sol_address": solAddress,
	}
	returnData := base64.StdEncoding.EncodeToString([]byte(helpers.ConvertJsonString(params)))
	return helpers.BuildUri(
		installUri,
		map[string]string{
			"install_code": installCode,
			"return_data":  returnData,
		},
	), nil
}

func (s *Service) StoreDefiAppGetWallet(ctx context.Context, apiKey string) (string, error) {
	if apiKey == "" {
		return "", errs.NewError(errs.ErrBadRequest)
	}
	storeDefiApp, err := s.dao.FirstStoreDefiApp(
		daos.GetDBMainCtx(ctx),
		map[string][]interface{}{
			"api_key = ?": {apiKey},
		},
		map[string][]interface{}{},
		[]string{},
	)
	if err != nil {
		return "", errs.NewError(err)
	}
	if storeDefiApp == nil {
		return "", errs.NewError(errs.ErrBadRequest)
	}
	return storeDefiApp.SolAddress, nil
}
