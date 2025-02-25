package services

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"math/big"
	"net/http"
	"strings"
	"time"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/daos"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/helpers"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/serializers"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services/3rd/ethapi"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services/3rd/lighthouse"
	"github.com/jinzhu/gorm"
)

func (s *Service) InfraTwitterAppAuthenInstall(ctx context.Context, installCode string, installUri string) (string, error) {
	err := func() error {
		if installCode == "" {
			return errs.NewError(errs.ErrBadRequest)
		}
		infraTwitterApp, err := s.dao.FirstInfraTwitterApp(
			daos.GetDBMainCtx(ctx),
			map[string][]interface{}{
				"install_code = ?": {installCode},
			},
			map[string][]interface{}{}, []string{},
		)
		if err != nil {
			return errs.NewError(err)
		}
		if infraTwitterApp == nil {
			var res struct {
				Result string `json:"result"`
			}
			err = helpers.CurlURL(s.conf.InfraTwitterApp.InfraAuthUri+"?code="+installCode, http.MethodGet, nil, nil, &res)
			if err != nil {
				return errs.NewError(err)
			}
			if res.Result == "" {
				return errs.NewError(errs.ErrBadRequest)
			}
			infraTwitterApp = &models.InfraTwitterApp{
				Address:     res.Result,
				InstallCode: installCode,
			}
		}
		err = s.dao.Save(daos.GetDBMainCtx(ctx), infraTwitterApp)
		if err != nil {
			return errs.NewError(err)
		}
		return nil
	}()
	if err != nil {
		return helpers.BuildUri(
			installUri,
			map[string]string{
				"error": err.Error(),
			},
		), nil
	}
	redirectUri := helpers.BuildUri(
		s.conf.InfraTwitterApp.RedirectUri,
		map[string]string{
			"install_code": installCode,
			"install_uri":  installUri,
		},
	)
	return helpers.BuildUri(
		"https://twitter.com/i/oauth2/authorize",
		map[string]string{
			"client_id":             s.conf.InfraTwitterApp.OauthClientId,
			"state":                 "state",
			"response_type":         "code",
			"code_challenge":        "challenge",
			"code_challenge_method": "plain",
			"scope":                 "offline.access+tweet.read+tweet.write+users.read+follows.write+like.write+like.read+users.read",
			"redirect_uri":          redirectUri,
		},
	), nil
}

func (s *Service) InfraTwitterAppAuthenCallback(ctx context.Context, installCode string, installUri string, code string) (string, error) {
	if installCode == "" || code == "" {
		return "", errs.NewError(errs.ErrBadRequest)
	}
	infraTwitterApp, err := func() (*models.InfraTwitterApp, error) {
		redirectUri := helpers.BuildUri(
			s.conf.InfraTwitterApp.RedirectUri,
			map[string]string{
				"install_code": installCode,
				"install_uri":  installUri,
			},
		)
		respOauth, err := s.twitterAPI.TwitterOauthCallbackForSampleApp(
			s.conf.InfraTwitterApp.OauthClientId, s.conf.InfraTwitterApp.OauthClientSecret, code, redirectUri)
		if err != nil {
			return nil, errs.NewError(err)
		}
		if respOauth != nil && respOauth.AccessToken != "" {
			twitterUser, err := s.twitterAPI.GetTwitterMe(respOauth.AccessToken)
			if err != nil {
				return nil, errs.NewError(err)
			}
			twitterInfo, err := s.dao.FirstTwitterInfo(
				daos.GetDBMainCtx(ctx),
				map[string][]interface{}{
					"twitter_id = ?": {twitterUser.ID},
				},
				map[string][]interface{}{},
				false,
			)
			if err != nil {
				return nil, errs.NewError(err)
			}
			if twitterInfo == nil {
				twitterInfo = &models.TwitterInfo{
					TwitterID: twitterUser.ID,
				}
			}
			twitterInfo.TwitterAvatar = twitterUser.ProfileImageURL
			twitterInfo.TwitterName = twitterUser.Name
			twitterInfo.TwitterUsername = twitterUser.UserName
			twitterInfo.AccessToken = respOauth.AccessToken
			twitterInfo.RefreshToken = respOauth.RefreshToken
			twitterInfo.ExpiresIn = respOauth.ExpiresIn
			twitterInfo.Scope = respOauth.Scope
			twitterInfo.TokenType = respOauth.TokenType
			twitterInfo.OauthClientId = s.conf.InfraTwitterApp.OauthClientId
			twitterInfo.OauthClientSecret = s.conf.InfraTwitterApp.OauthClientSecret
			twitterInfo.Description = twitterUser.Description
			twitterInfo.RefreshError = "OK"
			expiredAt := time.Now().Add(time.Second * time.Duration(respOauth.ExpiresIn-(60*20)))
			twitterInfo.ExpiredAt = &expiredAt
			err = s.dao.Save(daos.GetDBMainCtx(ctx), twitterInfo)
			if err != nil {
				return nil, errs.NewError(err)
			}
			infraTwitterApp, err := s.dao.FirstInfraTwitterApp(
				daos.GetDBMainCtx(ctx),
				map[string][]interface{}{
					"install_code = ?": {installCode},
				},
				map[string][]interface{}{}, []string{},
			)
			if err != nil {
				return nil, errs.NewError(err)
			}
			if infraTwitterApp == nil {
				return nil, errs.NewError(errs.ErrBadRequest)
			}
			infraTwitterApp.TwitterInfoID = twitterInfo.ID
			infraTwitterApp.TwitterInfo = twitterInfo
			err = s.dao.Save(daos.GetDBMainCtx(ctx), infraTwitterApp)
			if err != nil {
				return nil, errs.NewError(err)
			}
			return infraTwitterApp, nil
		}
		return nil, errs.NewError(errs.ErrBadRequest)
	}()
	if err != nil {
		return helpers.BuildUri(
			installUri,
			map[string]string{
				"install_code": installCode,
				"error":        err.Error(),
			},
		), nil
	}
	params := map[string]string{
		"address":          infraTwitterApp.Address,
		"twitter_id":       infraTwitterApp.TwitterInfo.TwitterID,
		"twitter_username": infraTwitterApp.TwitterInfo.TwitterUsername,
		"twitter_name":     infraTwitterApp.TwitterInfo.TwitterName,
	}
	returnData := base64.StdEncoding.EncodeToString([]byte(helpers.ConvertJsonString(params)))
	return helpers.BuildUri(
		installUri,
		map[string]string{
			"install_code": installCode,
			"return_data":  returnData,
		},
	), nil
}

// func (s *Service) InfraTwitterAppExecuteRequest(ctx context.Context, infraCode string, apiKey string, rawStr string) (string, error) {
// 	rawReq := []byte(rawStr)
// 	resp, err := func() (interface{}, error) {
// 		obj, err := s.dao.FirstAgentStoreInstall(
// 			daos.GetDBMainCtx(ctx),
// 			map[string][]interface{}{
// 				"code = ?": {infraCode},
// 			},
// 			map[string][]interface{}{},
// 			[]string{},
// 		)
// 		if err != nil {
// 			return "", errs.NewError(err)
// 		}
// 		if obj == nil {
// 			return "", errs.NewError(errs.ErrBadRequest)
// 		}
// 		infraTwitterApp, err := s.dao.FirstInfraTwitterApp(
// 			daos.GetDBMainCtx(ctx),
// 			map[string][]interface{}{
// 				"api_key = ?": {apiKey},
// 			},
// 			map[string][]interface{}{
// 				"TwitterInfo": {},
// 			},
// 			[]string{},
// 		)
// 		if err != nil {
// 			return "", errs.NewError(err)
// 		}
// 		var reqMethod struct {
// 			Method string `json:"method"`
// 		}
// 		err = json.Unmarshal(rawReq, &reqMethod)
// 		if err != nil {
// 			return nil, errs.NewError(err)
// 		}
// 		switch reqMethod.Method {
// 		case "getUserById":
// 			{
// 				var req struct {
// 					Params struct {
// 						Id string `json:"id"`
// 					} `json:"params"`
// 				}
// 				err := json.Unmarshal(rawReq, &req)
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				user, err := s.GetTwitterUserByID(ctx, req.Params.Id)
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				return user, nil
// 			}
// 		case "getUserByUsername":
// 			{
// 				var req struct {
// 					Params struct {
// 						Username string `json:"username"`
// 					} `json:"params"`
// 				}
// 				err := json.Unmarshal(rawReq, &req)
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				resp, err := s.GetTwitterUserByUsername(ctx, req.Params.Username)
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				return resp, nil
// 			}
// 		case "searchUsers":
// 			{
// 				var req struct {
// 					Params struct {
// 						Query           string `json:"query"`
// 						PaginationToken string `json:"pagination_token"`
// 					} `json:"params"`
// 				}
// 				err := json.Unmarshal(rawReq, &req)
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				resp, err := s.SearchUsers(ctx, req.Params.Query, req.Params.PaginationToken)
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				return resp, nil
// 			}
// 		case "seachUserByQuery":
// 			{
// 				var req struct {
// 					Params struct {
// 						Username string `json:"username"`
// 					} `json:"params"`
// 				}
// 				err := json.Unmarshal(rawReq, &req)
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				resp, err := s.SeachTwitterUserByQuery(ctx, req.Params.Username)
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				return resp, nil
// 			}
// 		case "getUserTweets":
// 			{
// 				var req struct {
// 					Params struct {
// 						TwitterID       string `json:"twitter_id"`
// 						PaginationToken string `json:"pagination_token"`
// 						MaxResults      int    `json:"max_results"`
// 					} `json:"params"`
// 				}
// 				err := json.Unmarshal(rawReq, &req)
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				resp, err := s.GetListUserTweets(ctx, req.Params.TwitterID, req.Params.PaginationToken, req.Params.MaxResults)
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				return resp, nil
// 			}
// 		case "searchRecentTweet":
// 			{
// 				var req struct {
// 					Params struct {
// 						Query           string `json:"query"`
// 						PaginationToken string `json:"pagination_token"`
// 						MaxResults      int    `json:"max_results"`
// 					} `json:"params"`
// 				}
// 				err := json.Unmarshal(rawReq, &req)
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				resp, err := s.SearchRecentTweet(ctx, req.Params.Query, req.Params.PaginationToken, req.Params.MaxResults)
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				return resp, nil
// 			}
// 		case "tweet":
// 			{
// 				if infraTwitterApp == nil {
// 					return "", errs.NewError(errs.ErrBadRequest)
// 				}
// 				var req struct {
// 					Params struct {
// 						Content string `json:"content"`
// 					} `json:"params"`
// 				}
// 				err := json.Unmarshal(rawReq, &req)
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				tweetId, err := helpers.PostTweetByToken(infraTwitterApp.TwitterInfo.AccessToken, req.Params.Content, "")
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				return tweetId, nil
// 			}
// 		case "replyToTweet":
// 			{
// 				if infraTwitterApp == nil {
// 					return "", errs.NewError(errs.ErrBadRequest)
// 				}
// 				var req struct {
// 					Params struct {
// 						TweetId string `json:"tweet_id"`
// 						Content string `json:"content"`
// 					} `json:"params"`
// 				}
// 				err := json.Unmarshal(rawReq, &req)
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				tweetId, err := helpers.ReplyTweetByToken(infraTwitterApp.TwitterInfo.AccessToken, req.Params.Content, req.Params.TweetId, "")
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				return tweetId, nil
// 			}
// 		case "retweet":
// 			{
// 				if infraTwitterApp == nil {
// 					return "", errs.NewError(errs.ErrBadRequest)
// 				}
// 				var req struct {
// 					Params struct {
// 						TweetId string `json:"tweet_id"`
// 					} `json:"params"`
// 				}
// 				twitter, err := helpers.GetTwitterUserMe(infraTwitterApp.TwitterInfo.AccessToken)
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				err = json.Unmarshal(rawReq, &req)
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				tweetId, err := helpers.RepostTweetByToken(infraTwitterApp.TwitterInfo.AccessToken, twitter.Data.ID, req.Params.TweetId)
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				return tweetId, nil
// 			}
// 		case "quoteTweet":
// 			{
// 				if infraTwitterApp == nil {
// 					return "", errs.NewError(errs.ErrBadRequest)
// 				}
// 				var req struct {
// 					Params struct {
// 						TweetId string `json:"tweet_id"`
// 						Content string `json:"content"`
// 					} `json:"params"`
// 				}
// 				err = json.Unmarshal(rawReq, &req)
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				tweetId, err := helpers.QuoteTweetByToken(infraTwitterApp.TwitterInfo.AccessToken, req.Params.Content, req.Params.TweetId)
// 				if err != nil {
// 					return nil, errs.NewError(err)
// 				}
// 				return tweetId, nil
// 			}
// 		default:
// 			{
// 				return nil, errs.NewError(errs.ErrBadRequest)
// 			}
// 		}
// 	}()
// 	if err != nil {
// 		return "", errs.NewError(err)
// 	}
// 	return helpers.ConvertJsonString(resp), nil
// }

func (s *Service) CreateInfraTwitterAppRequest(ctx context.Context, event *ethapi.RealWorldAgentExecutionRequested) error {
	err := daos.WithTransaction(
		daos.GetDBMainCtx(ctx),
		func(tx *gorm.DB) error {
			if strings.EqualFold(s.conf.InfraTwitterApp.AgentAddress, event.ContractAddress) {
				eventHash := fmt.Sprintf("%s_%d", event.TxHash, event.Index)
				inst, err := s.dao.FirstInfraRequest(tx,
					map[string][]interface{}{
						"contract_address = ?": {strings.ToLower(event.ContractAddress)},
						"uuid = ?":             {event.Uuid},
					},
					map[string][]interface{}{},
					[]string{},
				)
				if err != nil {
					return errs.NewError(err)
				}

				if inst == nil {
					agentInfo, err := s.dao.FirstAgentInfo(tx,
						map[string][]interface{}{
							"agent_contract_address = ?": {strings.ToLower(event.ContractAddress)},
						},
						map[string][]interface{}{},
						[]string{},
					)
					inst = &models.InfraRequest{
						TxHash:          strings.ToLower(event.TxHash),
						ContractAddress: strings.ToLower(event.ContractAddress),
						EventId:         eventHash,
						TxAt:            time.Unix(int64(event.Timestamp), 0),
						Status:          models.InfraRequestStatusPending,
						Uuid:            event.Uuid,
						Data:            event.Data,
						Creator:         strings.ToLower(event.Creator),
						ActId:           event.ActId.Uint64(),
					}

					if agentInfo != nil {
						inst.NetworkID = agentInfo.NetworkID
						inst.AgentInfoID = agentInfo.ID
					}
					if inst.NetworkID == 0 {
						inst.NetworkID = s.conf.InfraTwitterApp.NetworkID
					}

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
}

func (s *Service) JobExecuteInfraTwitterAppRequest(ctx context.Context) error {
	err := s.JobRunCheck(
		ctx, "JobExecuteInfraTwitterAppRequest",
		func() error {
			agents, err := s.dao.FindInfraRequest(
				daos.GetDBMainCtx(ctx),
				map[string][]interface{}{
					`status = ?`: {models.InfraRequestStatusPending},
				},
				map[string][]interface{}{},
				[]string{},
				0,
				50,
			)
			if err != nil {
				return errs.NewError(err)
			}
			var retErr error
			for _, agent := range agents {
				err = s.InfraTwitterAppExecuteRequestByID(ctx, agent.ID)
				if err != nil {
					retErr = errs.MergeError(retErr, errs.NewError(err))
				}
			}
			return retErr
		},
	)
	if err != nil {
		return errs.NewError(err)
	}
	return nil
}

func (s *Service) InfraTwitterAppExecuteRequestByID(ctx context.Context, reqID uint) error {
	err := s.JobRunCheck(
		ctx, fmt.Sprintf("InfraTwitterAppExecuteRequestByID_%d", reqID),
		func() error {
			reqInfo, err := s.dao.FirstInfraRequestByID(daos.GetDBMainCtx(ctx),
				reqID,
				map[string][]interface{}{},
				false,
			)
			if err != nil {
				return errs.NewError(err)
			}

			if reqInfo != nil && reqInfo.Status == models.InfraRequestStatusPending {
				rawReq, _, err := lighthouse.DownloadDataSimple(reqInfo.Data)
				if err != nil {
					return errs.NewError(err)
				}
				resp, err := func() (interface{}, error) {
					infraTwitterApp, err := s.dao.FirstInfraTwitterApp(
						daos.GetDBMainCtx(ctx),
						map[string][]interface{}{
							"address = ?": {reqInfo.Creator},
						},
						map[string][]interface{}{
							"TwitterInfo": {},
						},
						[]string{},
					)
					if err != nil {
						return "", errs.NewError(err)
					}
					var reqMethod struct {
						Method string `json:"method"`
					}
					err = json.Unmarshal(rawReq, &reqMethod)
					if err != nil {
						return nil, errs.NewError(err)
					}
					switch reqMethod.Method {
					case "getUserById":
						{
							var req struct {
								Params struct {
									Id string `json:"id"`
								} `json:"params"`
							}
							err := json.Unmarshal(rawReq, &req)
							if err != nil {
								return nil, errs.NewError(err)
							}
							user, err := s.GetTwitterUserByID(ctx, req.Params.Id)
							if err != nil {
								return nil, errs.NewError(err)
							}
							return user, nil
						}
					case "getUserByUsername":
						{
							var req struct {
								Params struct {
									Username string `json:"username"`
								} `json:"params"`
							}
							err := json.Unmarshal(rawReq, &req)
							if err != nil {
								return nil, errs.NewError(err)
							}
							resp, err := s.GetTwitterUserByUsername(ctx, req.Params.Username)
							if err != nil {
								return nil, errs.NewError(err)
							}
							return resp, nil
						}
					case "seachUserByQuery":
						{
							var req struct {
								Params struct {
									Username string `json:"username"`
								} `json:"params"`
							}
							err := json.Unmarshal(rawReq, &req)
							if err != nil {
								return nil, errs.NewError(err)
							}
							resp, err := s.SeachTwitterUserByQuery(ctx, req.Params.Username)
							if err != nil {
								return nil, errs.NewError(err)
							}
							return resp, nil
						}
					case "getUserTweets":
						{
							var req struct {
								Params struct {
									TwitterID       string `json:"twitter_id"`
									PaginationToken string `json:"pagination_token"`
									MaxResults      int    `json:"max_results"`
								} `json:"params"`
							}
							err := json.Unmarshal(rawReq, &req)
							if err != nil {
								return nil, errs.NewError(err)
							}
							resp, err := s.GetListUserTweets(ctx, req.Params.TwitterID, req.Params.PaginationToken, req.Params.MaxResults)
							if err != nil {
								return nil, errs.NewError(err)
							}
							return resp, nil
						}
					case "tweet":
						{
							if infraTwitterApp == nil {
								return "", errs.NewError(errs.ErrBadRequest)
							}
							var req struct {
								Params struct {
									Content string `json:"content"`
								} `json:"params"`
							}
							err := json.Unmarshal(rawReq, &req)
							if err != nil {
								return nil, errs.NewError(err)
							}
							if infraTwitterApp.TwitterInfo == nil {
								return nil, errs.NewError(errs.ErrUnAuthorization)
							}
							tweetId, err := helpers.ReplyTweetByToken(infraTwitterApp.TwitterInfo.AccessToken, req.Params.Content, "", "")
							if err != nil {
								return nil, errs.NewError(err)
							}
							return tweetId, nil
						}
					default:
						{
							return nil, errs.NewError(errs.ErrBadRequest)
						}
					}
				}()
				var rawData string
				if err != nil {
					rawData = helpers.ConvertJsonString(&serializers.Resp{Error: errs.NewError(err)})
				} else {
					rawData = helpers.ConvertJsonString(&serializers.Resp{Result: resp})
				}
				ipfsHash, err := s.IpfsUploadDataForName(ctx, "data", []byte(rawData))
				if err != nil {
					return errs.NewError(err)
				}
				updateFields := map[string]interface{}{
					"result": ipfsHash,
				}

				//TODO: call contract result
				prk := s.GetAddressPrk(s.conf.InfraTwitterApp.WorkerAddress)
				txHash, err := s.GetEthereumClient(ctx, reqInfo.NetworkID).
					ERC20RealWorldAgentSubmitSolution(
						s.conf.InfraTwitterApp.AgentAddress,
						prk,
						models.Number2BigInt(fmt.Sprintf("%d", reqInfo.ActId), 18),
						[]byte(ipfsHash),
					)
				if err != nil {
					updateFields["error"] = err.Error()
					updateFields["status"] = models.InfraRequestStatusError
				} else {
					updateFields["status"] = models.InfraRequestStatusExecuted
					updateFields["result_hash"] = txHash
				}

				_ = daos.GetDBMainCtx(ctx).Model(&models.InfraRequest{}).
					Where("id = ?", reqInfo.ID).
					Updates(updateFields)
			}

			return nil
		},
	)
	if err != nil {
		return errs.NewError(err)
	}
	return nil

}

func (s *Service) RetrySubmitResultByID(ctx context.Context, reqID uint) error {
	err := s.JobRunCheck(
		ctx, fmt.Sprintf("RetrySubmitResultByID_%d", reqID),
		func() error {
			reqInfo, err := s.dao.FirstInfraRequestByID(daos.GetDBMainCtx(ctx),
				reqID,
				map[string][]interface{}{},
				false,
			)
			if err != nil {
				return errs.NewError(err)
			}

			if reqInfo != nil && reqInfo.Result != "" &&
				reqInfo.Status == models.InfraRequestStatusError {
				updateFields := map[string]interface{}{}
				//TODO: call contract result
				prk := s.GetAddressPrk(s.conf.InfraTwitterApp.WorkerAddress)
				txHash, err := s.GetEthereumClient(ctx, reqInfo.NetworkID).
					ERC20RealWorldAgentSubmitSolution(
						s.conf.InfraTwitterApp.AgentAddress,
						prk,
						big.NewInt(int64(reqInfo.ActId)),
						[]byte(reqInfo.Result),
					)
				if err != nil {
					updateFields["error"] = err.Error()
				} else {
					updateFields["status"] = models.InfraRequestStatusExecuted
					updateFields["result_hash"] = txHash
				}

				_ = daos.GetDBMainCtx(ctx).Model(&models.InfraRequest{}).
					Where("id = ?", reqInfo.ID).
					Updates(updateFields)
			}
			return nil
		},
	)
	if err != nil {
		return errs.NewError(err)
	}
	return nil

}
