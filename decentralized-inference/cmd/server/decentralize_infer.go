package server

import (
	"decentralized-inference/internal/client"
	"decentralized-inference/internal/config"
	"decentralized-inference/internal/logger"
	"decentralized-inference/internal/models"
	"decentralized-inference/internal/rest"
	"decentralized-inference/internal/types"
	"encoding/json"
	"fmt"
	"github.com/sashabaranov/go-openai"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

type parsedObject struct {
	Id      string `json:"id"`
	Object  string `json:"object"`
	Created int64  `json:"created"`
	Model   string `json:"model"`
	Choices []struct {
		Index int `json:"index"`
		Delta struct {
			Content string `json:"content"`
		} `json:"delta"`
		FinishReason         interface{} `json:"finish_reason"`
		ContentFilterResults interface{} `json:"content_filter_results"`
	} `json:"choices"`
	SystemFingerprint string `json:"system_fingerprint"`
	Message           string `json:"message"`
	Code              int    `json:"code"`
	OnchainData       struct {
		InferId       string      `json:"infer_id"`
		PbftCommittee interface{} `json:"pbft_committee"`
		Proposer      string      `json:"proposer"`
		InferTx       string      `json:"infer_tx"`
		ProposeTx     string      `json:"propose_tx"`
		InputCid      string      `json:"input_cid"`
		OutputCid     string      `json:"output_cid"`
	} `json:"onchain_data"`
}

func (rt *Server) CreateDecentralizeInfer(c *gin.Context) {
	rest.StreamResponseJSON(
		func(ctx *gin.Context) (interface{}, error) {
			outChan := make(chan types.StreamData, 1)
			request := &models.DecentralizeInferRequest{}
			if err := c.ShouldBindJSON(request); err != nil {
				return nil, rest.NewHttpErr(err, http.StatusBadRequest)
			}

			resp, err := rt.Service.CreateDecentralizeInferV2WithStream(c.Request.Context(), request, outChan)
			if err != nil {
				logger.GetLoggerInstanceFromContext(c.Request.Context()).Error("CreateDecentralizeInfer error", zap.Error(err))
				return nil, rest.NewHttpErr(err, http.StatusInternalServerError)
			}

			c.Header("Content-Type", "text/event-stream")
			c.Header("Cache-Control", "no-cache")
			c.Header("Connection", "keep-alive")
			c.Writer.WriteHeader(http.StatusOK)

			for v := range outChan {
				var response struct {
					Data openai.ChatCompletionResponse `json:"data"`
				}

				err = v.Err
				if err != nil {
					fmt.Println(err)
					continue
				}

				if err := json.Unmarshal(v.Data, &response); err != nil {
					continue
				}

				if response.Data.Choices == nil || len(response.Data.Choices) == 0 {
					//parse again with the other object
					//note: this is used by live api, not local.
					respData := &parsedObject{}
					if err := json.Unmarshal(v.Data, &respData); err != nil {
						continue
					}

					response.Data.ID = respData.Id
					response.Data.Object = respData.Object
					response.Data.Created = respData.Created
					response.Data.Model = respData.Model
					response.Data.Choices = []openai.ChatCompletionChoice{}

					if len(respData.Choices) > 0 {
						for _, choice := range respData.Choices {
							response.Data.Choices = append(response.Data.Choices, openai.ChatCompletionChoice{
								Message: openai.ChatCompletionMessage{Content: choice.Delta.Content},
								//FinishReason:         choice.FinishReason.(openai.FinishReason),
								Index: choice.Index,
								//ContentFilterResults: choice.ContentFilterResults.(openai.ContentFilterResults),
							})
						}
					}

				}

				stdata := rest.Response{
					Data:   response,
					Status: 1,
				}

				msg, _ := json.Marshal(stdata)
				fmt.Fprintf(c.Writer, "%s\n", string(msg))

				// Flush the data to the client
				if f, ok := c.Writer.(http.Flusher); ok {
					f.Flush()
				}

				// Simulate a delay
				time.Sleep(100 * time.Millisecond)

			}

			logger.GetLoggerInstanceFromContext(c.Request.Context()).Info("CreateDecentralizeInfer success", zap.Any("response", resp))
			return &rest.StreamResponse{
				IsNotStream: true,
				Data:        resp,
			}, nil
		}, c)
}

func (rt *Server) CreateDecentralizeInferNoAgent(c *gin.Context) {
	rest.ResponseJSON(
		func(ctx *gin.Context) (interface{}, error) {
			request := &models.DecentralizeInferNoAgentRequest{}
			if err := c.ShouldBindJSON(request); err != nil {
				return nil, rest.NewHttpErr(err, http.StatusBadRequest)
			}

			resp, err := rt.Service.CreateDecentralizeInferNoAgent(c.Request.Context(), request)
			if err != nil {
				logger.GetLoggerInstanceFromContext(c.Request.Context()).Error("CreateDecentralizeInfer error", zap.Error(err))
				return nil, rest.NewHttpErr(err, http.StatusInternalServerError)
			}

			logger.GetLoggerInstanceFromContext(c.Request.Context()).Info("CreateDecentralizeInfer success", zap.Any("response", resp))
			return resp, nil
		}, c)
}

func (rt *Server) GetDecentralizeInferResult(c *gin.Context) {
	rest.ResponseJSON(
		func(ctx *gin.Context) (interface{}, error) {
			request := &models.InferResultRequest{}
			if err := c.ShouldBindJSON(request); err != nil {
				return nil, rest.NewHttpErr(err, http.StatusBadRequest)
			}

			return rt.Service.GetDecentralizeInferResult(c.Request.Context(), request)
		}, c)
}

func (rt *Server) InsertChainConfig(c *gin.Context) {
	rest.ResponseJSON(
		func(ctx *gin.Context) (interface{}, error) {
			request := &config.ChatConfig{}
			if err := c.ShouldBindJSON(request); err != nil {
				return nil, rest.NewHttpErr(err, http.StatusBadRequest)
			}
			cli, err := client.NewClient(request.Rpc, models.ChainTypeEth, false, "", "")
			if err != nil {
				return nil, rest.NewHttpErr(err, http.StatusBadRequest)
			}
			chainID, err := cli.Client.ChainID(c.Request.Context())
			if err != nil {
				return nil, rest.NewHttpErr(err, http.StatusBadRequest)
			}
			err = rt.Service.RemoveAllChainConfig(c.Request.Context())
			if err != nil {
				return nil, rest.NewHttpErr(err, http.StatusBadRequest)
			}
			chainConfig := models.ChainConfig{
				ChainID:              chainID.String(),
				ListRPC:              []string{request.Rpc},
				AgentContractAddress: request.Contracts.SystemPromptManagerAddress,
				WorkerHubAddress:     request.Contracts.WorkerHubAddress,
				Type:                 models.ChainTypeEth,
			}
			return nil, rt.Service.InsertChainConfig(c.Request.Context(), &chainConfig)
		}, c)
}
