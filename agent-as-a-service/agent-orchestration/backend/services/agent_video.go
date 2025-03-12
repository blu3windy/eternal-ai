package services

import (
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/daos"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/helpers"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
	"github.com/jinzhu/gorm"
)

func (s *Service) CreateCoinForVideoByPostID(ctx context.Context, twitterPostID uint) error {
	err := s.JobRunCheck(
		ctx,
		fmt.Sprintf("CreateAgentVideoByPostID_%d", twitterPostID),
		func() error {
			err := daos.WithTransaction(
				daos.GetDBMainCtx(ctx),
				func(tx *gorm.DB) error {
					twitterPost, err := s.dao.FirstAgentTwitterPostByID(
						tx,
						twitterPostID,
						map[string][]interface{}{
							"AgentInfo":             {},
							"AgentInfo.TwitterInfo": {},
						},
						true,
					)
					if err != nil {
						return errs.NewError(err)
					}

					if twitterPost != nil && twitterPost.Status == models.AgentTwitterPostStatusReplied {
						inst, err := s.dao.FirstAgentVideo(
							tx,
							map[string][]interface{}{
								"agent_twitter_post_id = ?": {twitterPost.ID},
							},
							map[string][]interface{}{},
							[]string{},
						)
						if err != nil {
							return errs.NewError(err)
						}

						if inst == nil {
							coinDesc := strings.TrimSpace(fmt.Sprintf(`
							%s

							@%s tweet https://x.com/%s/status/%s`,
								twitterPost.ExtractContent,
								twitterPost.TwitterUsername, twitterPost.TwitterUsername,
								twitterPost.TwitterPostID,
							))

							inst := &models.AgentVideo{
								TokenNetworkID:     models.BASE_CHAIN_ID,
								TokenImageUrl:      twitterPost.ImageUrl,
								OwnerTwitterID:     twitterPost.TwitterID,
								AgentTwitterPostID: twitterPost.ID,
								TokenDesc:          twitterPost.ExtractContent,
								TokenStatus:        "pending",
								CoinDesc:           coinDesc,
							}

							user, _ := s.dao.FirstUser(
								tx,
								map[string][]interface{}{
									"network_id = ?": {models.GENERTAL_NETWORK_ID},
									"twitter_id = ?": {twitterPost.GetOwnerTwitterID()},
								},
								map[string][]interface{}{},
								false,
							)

							if user != nil {
								inst.UserAddress = strings.ToLower(user.Address)
							}

							if os.Getenv("DEV") == "true" {
								inst.PayoutRecipient = "0xcEa81Bc56E7431B920380Ca71F92a2bd6B52Bc30"
							} else {
								ethAddress, err := s.CreateETHAddress(ctx)
								if err != nil {
									return errs.NewError(err)
								}
								inst.PayoutRecipient = ethAddress
							}

							tokenInfo, _ := s.GenerateTokenInfoFromVideoPrompt(ctx, twitterPost.ExtractContent)
							if tokenInfo != nil && tokenInfo.TokenSymbol != "" {
								inst.TokenName = tokenInfo.TokenName
								inst.TokenSymbol = tokenInfo.TokenSymbol
							}

							//call api create coins
							inst.TokenAddress = "xxx"
							err = s.dao.Create(tx, inst)
							if err != nil {
								return errs.NewError(err)
							}
						}
					}

					return nil
				},
			)

			if err != nil {
				return errs.NewError(err)
			}

			return nil
		},
	)

	if err != nil {
		return errs.NewError(err)
	}
	return nil
}

func (s *Service) GenerateTokenInfoFromVideoPrompt(ctx context.Context, sysPrompt string) (*models.TweetParseInfo, error) {
	info := &models.TweetParseInfo{}
	sysPrompt = strings.ReplaceAll(sysPrompt, "@CryptoEternalAI", "")
	promptGenerateToken := fmt.Sprintf(`
						I want to generate my token base on this info
						'%s'

						token-name (generate if not provided, make sure it not empty)
						token-symbol (generate if not provided, make sure it not empty)

						Please return in string in json format including token-name, token-symbol, just only json without explanation  and token name limit with 15 characters
					`, sysPrompt)
	aiStr, err := s.openais["Lama"].ChatMessage(promptGenerateToken)
	if err != nil {
		return nil, errs.NewError(err)
	}
	fmt.Println(aiStr)
	if aiStr != "" {
		mapInfo := helpers.ExtractMapInfoFromOpenAI(aiStr)
		tokenSymbol := ""
		tokenName := ""
		if mapInfo != nil {

			if v, ok := mapInfo["token-symbol"]; ok {
				tokenSymbol = fmt.Sprintf(`%v`, v)
			}

			if v, ok := mapInfo["token-name"]; ok {
				tokenName = fmt.Sprintf(`%v`, v)
			}

			if tokenName == "" {
				tokenName = tokenSymbol
			}
		}
		info = &models.TweetParseInfo{
			TokenSymbol: tokenSymbol,
			TokenName:   tokenName,
		}
	}

	return info, nil
}

func (s *Service) GetListUserVideo(ctx context.Context, userAddress string) ([]*models.AgentVideo, error) {
	res, err := s.dao.FindAgentVideo(
		daos.GetDBMainCtx(ctx),
		map[string][]interface{}{
			"user_address = ? ": {strings.ToLower(userAddress)},
		},
		map[string][]interface{}{
			"AgentTwitterPost": {},
		},
		[]string{"id desc"},
		0,
		1000,
	)
	if err != nil {
		return nil, errs.NewError(err)
	}
	return res, nil
}
