package serializers

import (
	"bytes"
	"encoding/json"
	"github.com/sashabaranov/go-openai"
	"net/http"
)

type PreviewRequest struct {
	Messages  string  `json:"messages"`
	AgentID   *uint   `json:"agent_id"`
	KbId      *string `json:"kb_id"`
	ModelName *string `json:"model_name"`
	Stream    bool    `json:"stream"`
}

type HttpEventStreamResponse struct {
	Data []byte
}

func (ev HttpEventStreamResponse) ToOutPut() []byte {
	var byteBuffer bytes.Buffer
	byteBuffer.Write([]byte("data: "))
	byteBuffer.Write(ev.Data)
	byteBuffer.Write([]byte("\n\n"))
	return byteBuffer.Bytes()
}

var DoneResponseStreamData, _ = json.Marshal(ChatCompletionStreamResponse{Message: "DONE", Code: http.StatusOK})
var FakeResponseStreamData, _ = json.Marshal(ChatCompletionStreamResponse{
	Message: "",
	Code:    http.StatusContinue,
	ChatCompletionStreamResponse: openai.ChatCompletionStreamResponse{
		Choices: []openai.ChatCompletionStreamChoice{
			openai.ChatCompletionStreamChoice{
				Delta: openai.ChatCompletionStreamChoiceDelta{},
			},
		},
	},
})
var TimeoutResponseStreamData, _ = json.Marshal(ChatCompletionStreamResponse{Message: "Timeout", Code: http.StatusGatewayTimeout})

type ChatCompletionStreamResponse struct {
	openai.ChatCompletionStreamResponse `json:",inline"`
	Message                             string `json:"message"`
	Code                                int    `json:"code"`
}
