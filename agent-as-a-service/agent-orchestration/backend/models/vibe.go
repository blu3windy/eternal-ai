package models

import "github.com/jinzhu/gorm"

type VibeWhiteList struct {
	gorm.Model
	Email string `gorm:"unique_index"`
}

type VibeReferralCode struct {
	gorm.Model
	RefCode     string `gorm:"unique_index"`
	UserAddress string `gorm:"index"`
	Used        bool   `gorm:"default:false"`
}
