package openai

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"strings"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/logger"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/serializers"
	"github.com/sashabaranov/go-openai"
	"go.uber.org/zap"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
)

type OpenAI struct {
	BaseURL         string
	ApiKey          string
	AutoAgentApiUrl string
}

type ChatResponse struct {
	Id      string `json:"id"`
	Choices []*struct {
		Index   int `json:"index"`
		Message *struct {
			Content string `json:"content"`
			Role    string `json:"role"`
		} `json:"message"`
		FinishReason string `json:"finish_reason"`
	} `json:"choices"`
	Model   string `json:"model"`
	Object  string `json:"object"`
	Created int64  `json:"created"`
	Usage   *struct {
		PromptTokens     int `json:"prompt_tokens"`
		TotalTokens      int `json:"total_tokens"`
		CompletionTokens int `json:"completion_tokens"`
	} `json:"usage"`
}

func NewOpenAI(baseUrl, apiKey string) *OpenAI {
	return &OpenAI{
		BaseURL: baseUrl,
		ApiKey:  apiKey,
	}
}

func NewAgentAI(apiKey string) *OpenAI {
	return &OpenAI{
		ApiKey: apiKey,
	}
}

func (c OpenAI) ChatMessage(msgChat string) (string, error) {
	seed := models.RandSeed()
	path := fmt.Sprintf("%s/v1/chat/completions", c.BaseURL)
	bodyReq := map[string]interface{}{
		"model":  "NousResearch/Hermes-3-Llama-3.1-70B-FP8",
		"stream": false,
		"seed":   seed,
	}

	var err error
	logKey := "ChatMessage"
	tracerData := logger.NewTracerData()
	tracerData.Add("msgChat", msgChat)
	tracerData.Add("path", path)

	// log here
	defer func() {
		if err != nil {
			logger.Error("OpenAI", logKey, zap.Any("data", tracerData.Data()), zap.Error(err))
		} else {
			logger.Info("OpenAI", logKey, zap.Any("data", tracerData.Data()))
		}
	}()

	contents := []map[string]string{}
	contents = append(contents, map[string]string{"role": "system", "content": "You are a helpful assistant"})
	contents = append(contents, map[string]string{"role": "user", "content": msgChat})
	bodyReq["messages"] = contents

	tracerData.Add("bodyReq", bodyReq)

	//jsonString, _ := json.Marshal(bodyReq)
	//fmt.Println(string(jsonString))

	chatResp := ""
	bodyBytes, _ := json.Marshal(bodyReq)
	req, err := http.NewRequest("POST", path, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return chatResp, err
	}

	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", c.ApiKey))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return chatResp, err
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return chatResp, err
	}

	tracerData.Add("bodyReq", string(body))
	m := ChatResponse{}
	err = json.Unmarshal(body, &m)
	if err != nil {
		return chatResp, err
	}

	tracerData.Add("bodyReq.Parsed", m)
	if m.Choices != nil && len(m.Choices) > 0 {
		data := m.Choices[0]
		if data.Message != nil && data.Message.Content != "" {
			chatResp = data.Message.Content
		}
	}

	tracerData.Add("chatResp", chatResp)
	return chatResp, nil
}

func (c OpenAI) ChatMessageWithSystemPromp(msgChat, systemContent string) (string, error) {
	seed := models.RandSeed()
	path := fmt.Sprintf("%s/v1/chat/completions", c.BaseURL)
	bodyReq := map[string]interface{}{
		"model":  "NousResearch/Hermes-3-Llama-3.1-70B-FP8",
		"stream": false,
		"seed":   seed,
	}

	contents := []map[string]string{}
	contents = append(contents, map[string]string{"role": "system", "content": systemContent})
	contents = append(contents, map[string]string{"role": "user", "content": msgChat})
	bodyReq["messages"] = contents

	chatResp := ""
	bodyBytes, _ := json.Marshal(bodyReq)
	req, err := http.NewRequest("POST", path, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return chatResp, err
	}
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", c.ApiKey))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return chatResp, err
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return chatResp, err
	}

	m := ChatResponse{}
	err = json.Unmarshal(body, &m)
	if err != nil {
		return chatResp, err
	}
	if m.Choices != nil && len(m.Choices) > 0 {
		data := m.Choices[0]
		if data.Message != nil && data.Message.Content != "" {
			chatResp = data.Message.Content
		}
	}

	return chatResp, nil
}

func (c OpenAI) TestAgentPersinality(systemPrompt, userPrompt, baseUrl string) (string, error) {
	seed := models.RandSeed()
	bodyReq := map[string]interface{}{
		"model": "NousResearch/Hermes-3-Llama-3.1-70B-FP8",
		// "temperature": 0.01,
		"stream": false,
		"seed":   seed,
	}

	contents := []map[string]string{}
	contents = append(contents, map[string]string{"role": "system", "content": systemPrompt})
	contents = append(contents, map[string]string{"role": "user", "content": userPrompt})
	bodyReq["messages"] = contents

	chatResp := ""
	bodyBytes, _ := json.Marshal(bodyReq)
	req, err := http.NewRequest("POST", baseUrl, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return chatResp, err
	}
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", c.ApiKey))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return chatResp, err
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return chatResp, err
	}

	m := ChatResponse{}
	err = json.Unmarshal(body, &m)
	if err != nil {
		return chatResp, err
	}
	if m.Choices != nil && len(m.Choices) > 0 {
		data := m.Choices[0]
		if data.Message != nil && data.Message.Content != "" {
			chatResp = data.Message.Content
		}
	}

	return chatResp, nil
}

func (c OpenAI) CallDirectlyEternalLLM(messages, model, baseUrl string, options map[string]interface{}) (string, error) {
	seed := models.RandSeed()
	bodyReq := map[string]interface{}{
		"model":  model,
		"stream": false,
		"seed":   seed,
	}
	for k, v := range options {
		bodyReq[k] = v
	}
	contents := []map[string]string{}
	err := json.Unmarshal([]byte(messages), &contents)
	bodyReq["messages"] = contents

	chatResp := ""
	bodyBytes, _ := json.Marshal(bodyReq)
	req, err := http.NewRequest("POST", baseUrl, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return chatResp, err
	}
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", c.ApiKey))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return chatResp, err
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return chatResp, err
	}

	m := ChatResponse{}
	err = json.Unmarshal(body, &m)
	if err != nil {
		return chatResp, err
	}
	if m.Choices != nil && len(m.Choices) > 0 {
		data := m.Choices[0]
		if data.Message != nil && data.Message.Content != "" {
			chatResp = data.Message.Content
		}
	}

	return chatResp, nil
}

func (c OpenAI) CallStreamDirectlyEternalLLM(ctx context.Context, messages, model, baseUrl string, options map[string]interface{}, outputChan chan *models.ChatCompletionStreamResponse, errChan chan error, doneChan chan bool) {
	seed := rand.Int()
	var contents []openai.ChatCompletionMessage
	err := json.Unmarshal([]byte(messages), &contents)

	config := openai.DefaultConfig("")
	baseUrl = strings.Replace(baseUrl, "/chat/completions", "", 1)
	config.BaseURL = baseUrl
	client := openai.NewClientWithConfig(config)
	llmRequest := openai.ChatCompletionRequest{
		Model:    model,
		Stream:   true,
		Seed:     &seed,
		Messages: contents,
	}
	if value, ok := options["top_p"]; ok {
		llmRequest.TopP, _ = value.(float32)
	}
	if value, ok := options["max_tokens"]; ok {
		llmRequest.MaxTokens, _ = value.(int)
	}
	stream, err := client.CreateChatCompletionStream(
		ctx,
		llmRequest,
	)
	if err != nil {
		errChan <- err
		return
	}
	defer stream.Close()
	for {
		body, err := stream.RecvRaw()
		if errors.Is(err, io.EOF) {
			doneChan <- true
			break
		}
		var response models.ChatCompletionStreamResponse
		err = json.Unmarshal(body, &response)
		if err != nil {
			errChan <- fmt.Errorf("error when receive data from ai server: %v", err)
			return
		}
		outputChan <- &response
	}
	return
}

func (c OpenAI) TestAgentPersinalityV1(messages, baseUrl string) (string, error) {
	seed := models.RandSeed()
	bodyReq := map[string]interface{}{
		"model":  "NousResearch/Hermes-3-Llama-3.1-70B-FP8",
		"stream": false,
		"seed":   seed,
	}
	contents := []map[string]string{}
	err := json.Unmarshal([]byte(messages), &contents)
	bodyReq["messages"] = contents

	chatResp := ""
	bodyBytes, _ := json.Marshal(bodyReq)
	req, err := http.NewRequest("POST", baseUrl, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return chatResp, err
	}
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", c.ApiKey))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return chatResp, err
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return chatResp, err
	}

	m := ChatResponse{}
	err = json.Unmarshal(body, &m)
	if err != nil {
		return chatResp, err
	}
	if m.Choices != nil && len(m.Choices) > 0 {
		data := m.Choices[0]
		if data.Message != nil && data.Message.Content != "" {
			chatResp = data.Message.Content
		}
	}

	return chatResp, nil
}

func (c OpenAI) SummaryWebContent(webContent string) (string, error) {
	path := fmt.Sprintf("%s/v1/chat/completions", c.BaseURL)
	seed := models.RandSeed()
	bodyReq := map[string]interface{}{
		"model": "neuralmagic/Meta-Llama-3.1-405B-Instruct-quantized.w4a16",
		// "max_tokens":  200,
		"temperature": 0.01,
		"stream":      false,
		"seed":        seed,
	}

	userPrompt := fmt.Sprintf(`Summarize this crawled content, just reply summary without any additional explanation:\n%s`, webContent)
	contents := []map[string]string{}
	contents = append(contents, map[string]string{"role": "system", "content": `You are a helpful assistant summarizing content from web crawls. Your goal is to produce a concise, readable summary that preserves the text's original meaning, context, and key language. Remove any irrelevant details and focus on the main points, correcting grammar as needed for clarity. Ensure the summary flows logically, retains essential information, and is accurate, clear, and well-structured.`})
	contents = append(contents, map[string]string{"role": "user", "content": userPrompt})
	bodyReq["messages"] = contents

	chatResp := ""
	bodyBytes, _ := json.Marshal(bodyReq)
	req, err := http.NewRequest("POST", path, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return chatResp, err
	}
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", c.ApiKey))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return chatResp, err
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return chatResp, err
	}

	m := ChatResponse{}
	err = json.Unmarshal(body, &m)
	if err != nil {
		return chatResp, err
	}
	if m.Choices != nil && len(m.Choices) > 0 {
		data := m.Choices[0]
		if data.Message != nil && data.Message.Content != "" {
			chatResp = data.Message.Content
		}
	}

	return chatResp, nil
}

type AgentThinking struct {
	Question    string `json:"question"`
	Thought     string `json:"thought"`
	Action      string `json:"action"`
	ActionInput string `json:"action_input"`
	Observation string `json:"observation"`
	FinalAnswer string `json:"final_answer"`
}

func (c OpenAI) AgentChats(systemPrompt, baseUrl string, messages serializers.AgentChatMessageReq) (*ChatResponse, error) {
	m := ChatResponse{}
	seed := models.RandSeed()
	bodyReq := map[string]interface{}{
		"model":  "NousResearch/Hermes-3-Llama-3.1-70B-FP8",
		"stream": false,
		"seed":   seed,
	}

	contents := []map[string]string{}
	contents = append(contents, map[string]string{"role": "system", "content": systemPrompt})
	for _, item := range messages.Messages {
		contents = append(contents, map[string]string{"role": item.Role, "content": item.Content})
	}
	bodyReq["messages"] = contents

	bodyBytes, _ := json.Marshal(bodyReq)
	req, err := http.NewRequest("POST", baseUrl, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return &m, err
	}
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", c.ApiKey))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return &m, err
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return &m, err
	}

	err = json.Unmarshal(body, &m)
	if err != nil {
		return &m, err
	}

	return &m, nil
}
