package serializers

import (
	"time"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/types/numeric"
)

type UserTransactionResp struct {
	ID          uint                         `json:"id"`
	CreatedAt   time.Time                    `json:"created_at"`
	NetworkID   uint64                       `json:"network_id"`
	UserID      uint                         `json:"user_id"`
	Type        models.UserTransactionType   `json:"type"`
	FromAddress string                       `json:"from_address"`
	ToAddress   string                       `json:"to_address"`
	TxHash      string                       `json:"tx_hash"`
	Amount      numeric.BigFloat             `json:"amount"`
	Status      models.UserTransactionStatus `json:"status"`
}

func NewUserTransactionResp(m *models.UserTransaction) *UserTransactionResp {
	if m == nil {
		return nil
	}
	resp := &UserTransactionResp{
		ID:          m.ID,
		CreatedAt:   m.CreatedAt,
		NetworkID:   m.NetworkID,
		UserID:      m.UserID,
		Type:        m.Type,
		FromAddress: m.FromAddress,
		ToAddress:   m.ToAddress,
		TxHash:      m.TxHash,
		Amount:      m.Amount,
		Status:      m.Status,
	}
	return resp
}

func NewUserTransactionRespArry(arr []*models.UserTransaction) []*UserTransactionResp {
	resps := []*UserTransactionResp{}
	for _, m := range arr {
		resps = append(resps, NewUserTransactionResp(m))
	}
	return resps
}
