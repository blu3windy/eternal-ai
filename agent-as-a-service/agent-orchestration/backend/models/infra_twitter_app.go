package models

import (
	"github.com/jinzhu/gorm"
)

type InfraTwitterApp struct {
	gorm.Model
	InstallCode   string
	Address       string
	TwitterInfoID uint
	TwitterInfo   *TwitterInfo
}
