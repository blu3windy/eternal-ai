package serializers

import (
	"encoding/json"
	"time"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/types/numeric"
)

type UserProfileReq struct {
	Username    string                 `json:"username"`
	Description string                 `json:"description"`
	ImageURL    string                 `json:"image_url"`
	Social      map[string]interface{} `json:"social"`
}

type UserResp struct {
	ID              uint                   `json:"id"`
	CreatedAt       time.Time              `json:"created_at"`
	NetworkID       uint64                 `json:"network_id"`
	Address         string                 `json:"address"`
	Username        string                 `json:"username"`
	SubscriptionNum uint                   `json:"subscription_num"`
	Description     string                 `json:"description"`
	ImageURL        string                 `json:"image_url"`
	Social          map[string]interface{} `json:"social"`
	Price30d        numeric.BigFloat       `json:"price30d"`
	Price90d        numeric.BigFloat       `json:"price90d"`
	Subscribed      bool                   `json:"subscribed"`
	TotalLike       uint                   `json:"total_like"`
	TotalPost       uint                   `json:"total_post"`
	TotalMessage    uint                   `json:"total_message"`
	TipPayment      numeric.BigFloat       `json:"tip_payment"`
	TipReceive      numeric.BigFloat       `json:"tip_receive"`
	TwitterID       string                 `json:"twitter_id"`
	TwitterAvatar   string                 `json:"twitter_avatar"`
	TwitterUsername string                 `json:"twitter_username"`
	TwitterName     string                 `json:"twitter_name"`
	EthAddress      string                 `json:"eth_address"`
	TronAddress     string                 `json:"tron_address"`
	SolAddress      string                 `json:"sol_address"`
	EaiBalance      numeric.BigFloat       `json:"eai_balance"`
}

func NewUserResp(m *models.User) *UserResp {
	if m == nil {
		return nil
	}

	social := make(map[string]interface{})
	json.Unmarshal([]byte(m.Social), &social)

	resp := &UserResp{
		ID:              m.ID,
		CreatedAt:       m.CreatedAt,
		NetworkID:       m.NetworkID,
		Address:         m.Address,
		Username:        m.Username,
		Description:     m.Description,
		ImageURL:        m.ImageURL,
		Social:          social,
		Price30d:        m.Price30d,
		Price90d:        m.Price90d,
		Subscribed:      m.Subscribed,
		SubscriptionNum: m.SubscriptionNum,
		TotalLike:       m.TotalLike,
		TotalPost:       m.TotalPost,
		TotalMessage:    m.TotalMessage,
		TipPayment:      m.TipPayment,
		TipReceive:      m.TipReceive,
		TwitterID:       m.TwitterID,
		TwitterAvatar:   m.TwitterAvatar,
		TwitterUsername: m.TwitterUsername,
		TwitterName:     m.TwitterName,
		EthAddress:      m.EthAddress,
		TronAddress:     m.TronAddress,
		SolAddress:      m.SolAddress,
		EaiBalance:      m.EaiBalance,
	}
	return resp
}

func NewUserRespArr(arr []*models.User) []*UserResp {
	resps := []*UserResp{}
	for _, m := range arr {
		resps = append(resps, NewUserResp(m))
	}
	return resps
}

type InfraTwitterAppInfoResp struct {
	Address       string           `json:"address"`
	EaiBalance    numeric.BigFloat `json:"eai_balance"`
	TotalRequest  uint64           `json:"total_request"`
	RemainRequest uint64           `json:"remain_request"`
	ETHAddress    string           `json:"eth_address"`
}

func NewInfraTwitterAppInfoResp(m *models.InfraTwitterApp) *InfraTwitterAppInfoResp {
	if m == nil {
		return nil
	}
	return &InfraTwitterAppInfoResp{
		Address:       m.Address,
		EaiBalance:    m.EaiBalance,
		TotalRequest:  m.TotalRequest,
		RemainRequest: m.RemainRequest,
		ETHAddress:    m.ETHAddress,
	}
}
