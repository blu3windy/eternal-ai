package serializers

import (
	"time"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
)

type AgentLibraryResp struct {
	ID        uint      `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	Name      string    `json:"name"`
	SourceID  string    `json:"source_url"`
}

func NewAgentLibraryResp(m *models.AgentLibrary) *AgentLibraryResp {
	if m == nil {
		return nil
	}
	return &AgentLibraryResp{
		ID:        m.ID,
		CreatedAt: m.CreatedAt,
		Name:      m.Name,
		SourceID:  m.SourceURL,
	}
}

func NewAgentLibraryRespArray(arr []*models.AgentLibrary) []*AgentLibraryResp {
	resps := []*AgentLibraryResp{}
	for _, r := range arr {
		resps = append(resps, NewAgentLibraryResp(r))
	}
	return resps
}
