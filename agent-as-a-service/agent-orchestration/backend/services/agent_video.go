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
							recipient, err := s.dao.FirstAgentVideoRecipient(
								tx,
								map[string][]interface{}{
									"owner_twitter_id = ?": {twitterPost.TwitterID},
								},
								map[string][]interface{}{},
								[]string{},
							)
							if err != nil {
								return errs.NewError(err)
							}
							if recipient == nil {
								recipient = &models.AgentVideoRecipient{
									OwnerTwitterID: twitterPost.TwitterID,
								}
								if os.Getenv("DEV") == "true" {
									recipient.RecipientAddress = "0xcEa81Bc56E7431B920380Ca71F92a2bd6B52Bc30"
								} else {
									ethAddress, err := s.CreateETHAddress(ctx)
									if err != nil {
										return errs.NewError(err)
									}
									recipient.RecipientAddress = ethAddress
								}

								err = s.dao.Create(tx, inst)
								if err != nil {
									return errs.NewError(err)
								}
							}

							if recipient != nil {
								coinDesc := strings.TrimSpace(fmt.Sprintf(`
								%s
	
								@%s tweet https://x.com/%s/status/%s`,
									twitterPost.ExtractContent,
									twitterPost.TwitterUsername, twitterPost.TwitterUsername,
									twitterPost.TwitterPostID,
								))

								inst := &models.AgentVideo{
									TokenNetworkID:        models.BASE_CHAIN_ID,
									TokenImageUrl:         twitterPost.ImageUrl,
									OwnerTwitterID:        twitterPost.TwitterID,
									AgentTwitterPostID:    twitterPost.ID,
									TokenDesc:             twitterPost.ExtractContent,
									TokenStatus:           "pending",
									CoinDesc:              coinDesc,
									AgentVideoRecipientID: recipient.ID,
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

func (s *Service) GetListUserVideo(ctx context.Context, userAddres, search string) ([]*models.AgentVideo, error) {
	filters := map[string][]interface{}{
		"user_address = ? ": {strings.ToLower(userAddres)},
	}

	if search != "" {
		search = fmt.Sprintf("%%%s%%", strings.ToLower(search))
		filters[`
			LOWER(token_name) like ? 
			or LOWER(token_symbol) like ? 
			or LOWER(token_address) like ?
		`] = []any{search, search, search}
	}

	res, err := s.dao.FindAgentVideo(
		daos.GetDBMainCtx(ctx),
		filters,
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
