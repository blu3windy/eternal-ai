package services

import (
	"github.com/mymmrac/telego"
	"strconv"
	"strings"
)

var teleVideoActivitiesAlert *telego.Bot
var teleVideoActivitiesChatId int64
var ListVideoModelAddress = map[string]bool{
	"0x19aeeffbc0244be6187314a74a443a18aa2cceee": true,
}

func (s *Service) IsGenVideoModel(modelAddress string) bool {
	return ListVideoModelAddress[modelAddress]
}
func InitTeleVideoActivitiesAlert(token, chatId string) {
	if len(token) == 0 || len(chatId) == 0 {
		return
	}
	teleVideoActivitiesChatId, _ = strconv.ParseInt(chatId, 10, 64)
	teleVideoActivitiesAlert, _ = telego.NewBot(token, telego.WithDefaultDebugLogger())
}

func (s *Service) SendTeleVideoActivitiesAlert(msg string) {
	if teleVideoActivitiesAlert != nil {
		go func() {
			teleVideoActivitiesAlert.SendMessage(
				&telego.SendMessageParams{
					ChatID: telego.ChatID{
						ID: teleVideoActivitiesChatId,
					},
					Text: strings.TrimSpace(msg),
				},
			)
		}()
	}
}
