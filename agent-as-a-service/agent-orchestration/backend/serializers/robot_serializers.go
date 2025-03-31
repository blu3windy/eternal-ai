package serializers

import (
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/types/numeric"
)

type RobotSaleWalletReq struct {
	ProjectID   string `json:"project_id"`
	UserAddress string `json:"user_address"`
}

type RobotSaleWalletResp struct {
	ProjectID   string           `json:"project_id"`
	UserAddress string           `json:"user_address"`
	SOLAddress  string           `json:"sol_address"`
	SolBalance  numeric.BigFloat `json:"sol_balance"`
}

func NewRobotSaleWalletResp(m *models.RobotSaleWallet) *RobotSaleWalletResp {
	return &RobotSaleWalletResp{
		ProjectID:   m.ProjectID,
		UserAddress: m.UserAddress,
		SOLAddress:  m.SOLAddress,
		SolBalance:  m.SOLBalance,
	}
}
