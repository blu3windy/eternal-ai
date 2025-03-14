package services

import (
	"github.com/mymmrac/telego"
	"strconv"
	"strings"
)

var teleVideoActivitiesAlert *telego.Bot
var teleVideoActivitiesChatId int64

var teleMagicVideoActivitiesAlert *telego.Bot
var teleMagicVideoActivitiesChatId int64

func InitTeleMagicVideoActivitiesAlert(token, chatId string) {
	if len(token) == 0 || len(chatId) == 0 {
		return
	}
	teleMagicVideoActivitiesChatId, _ = strconv.ParseInt(chatId, 10, 64)
	teleMagicVideoActivitiesAlert, _ = telego.NewBot(token, telego.WithDefaultDebugLogger())
}
func (s *Service) SendTeleMagicVideoActivitiesAlert(msg string) {
	if teleMagicVideoActivitiesAlert != nil {
		go func() {
			teleMagicVideoActivitiesAlert.SendMessage(
				&telego.SendMessageParams{
					ChatID: telego.ChatID{
						ID: teleMagicVideoActivitiesChatId,
					},
					Text: strings.TrimSpace(msg),
				},
			)
		}()
	}
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
