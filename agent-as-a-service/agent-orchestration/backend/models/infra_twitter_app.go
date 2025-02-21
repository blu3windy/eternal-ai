package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

type InfraTwitterApp struct {
	gorm.Model
	InstallCode   string
	Address       string
	TwitterInfoID uint
	TwitterInfo   *TwitterInfo
}

type (
	InfraRequestStatus string
)

const (
	InfraRequestStatusPending  InfraRequestStatus = "pending"
	InfraRequestStatusExecuted InfraRequestStatus = "executed"
	InfraRequestStatusInvalid  InfraRequestStatus = "invalid"
)

type InfraRequest struct {
	gorm.Model
	NetworkID       uint64
	AgentInfoID     uint `gorm:"index"`
	AgentInfo       *AgentInfo
	TxHash          string `gorm:"index"`
	ContractAddress string `gorm:"index"`
	EventId         string `gorm:"unique_index:infra_request_main_idx"`
	TxAt            time.Time
	Status          InfraRequestStatus
	Uuid            string `gorm:"index"`
	Data            string `gorm:"type:longtext"`
	Creator         string `gorm:"index"`
	ResultHash      string
	Result          string `gorm:"type:longtext"`
	Error           string
	ActId           uint64
}
