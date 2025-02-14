package models

import (
	"github.com/jinzhu/gorm"
)

type StoreDefiApp struct {
	gorm.Model
	InstallCode string `gorm:"unique_index"`
	ApiKey      string `gorm:"unique_index"`
	SolAddress  string `gorm:"unique_index"`
}
