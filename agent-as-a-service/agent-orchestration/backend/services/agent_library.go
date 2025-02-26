package services

import (
	"context"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/daos"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
)

func (s *Service) GetListAgentLibrary(ctx context.Context, networkID uint64) ([]*models.AgentLibrary, error) {
	res, err := s.dao.FindAgentLibrary(
		daos.GetDBMainCtx(ctx),
		map[string][]interface{}{
			"network_id = ? ": {networkID},
		},
		map[string][]interface{}{},
		[]string{"id desc"},
		0,
		1000,
	)
	if err != nil {
		return nil, errs.NewError(err)
	}
	return res, nil
}
