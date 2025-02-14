package models

import (
	"github.com/jinzhu/gorm"
)

type InfraTwitterApp struct {
	gorm.Model
	InstallCode   string
	ApiKey        string
	TwitterInfoID uint
	TwitterInfo   *TwitterInfo
}
