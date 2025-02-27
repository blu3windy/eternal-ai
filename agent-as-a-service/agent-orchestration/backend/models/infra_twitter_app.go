package models

import (
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/types/numeric"
	"github.com/jinzhu/gorm"
)

type InfraTwitterApp struct {
	gorm.Model
	Address       string
	TwitterInfoID uint
	TwitterInfo   *TwitterInfo
	EaiBalance    numeric.BigFloat `gorm:"type:decimal(36,18);default:0"`
	TotalRequest  uint64
	RemainRequest uint64
}
