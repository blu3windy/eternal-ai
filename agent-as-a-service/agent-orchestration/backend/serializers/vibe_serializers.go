package serializers

import (
	"time"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
)

type AgentUserComment struct {
	ID          uint      `json:"id"`
	Comment     string    `json:"comment"`
	Rating      float64   `json:"rating"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	UserAddress string    `json:"user_address"`
	User        *UserResp `json:"user"`
	AgentInfoID uint      `json:"agent_info_id"`
}

func NewAgentUserComment(m *models.AgentUserComment) *AgentUserComment {
	return &AgentUserComment{
		ID:          m.ID,
		Comment:     m.Comment,
		Rating:      m.Rating,
		CreatedAt:   m.CreatedAt,
		UpdatedAt:   m.UpdatedAt,
		UserAddress: m.UserAddress,
		AgentInfoID: m.AgentInfoID,
		User:        NewUserResp(m.User),
	}
}

func NewAgentUserCommentArray(arr []*models.AgentUserComment) []*AgentUserComment {
	resps := []*AgentUserComment{}
	for _, r := range arr {
		resps = append(resps, NewAgentUserComment(r))
	}
	return resps
}
