package models

import (
	"github.com/sashabaranov/go-openai"
)

type ChatCompletionStreamResponse struct {
	openai.ChatCompletionStreamResponse `json:",inline"`
	Message                             string                `json:"message"`
	Code                                int                   `json:"code"`
	OnchainData                         CompletionOnChainData `json:"onchain_data"`
}

type CompletionOnChainData struct {
	InferID             string   `json:"infer_id"`
	AssignmentAddresses []string `json:"pbft_committee"`
	SubmitAddress       string   `json:"proposer"`
	InferTx             string   `json:"infer_tx"`
	SubmitTx            string   `json:"propose_tx"`
	SeizeMinerTx        string   `json:"-"`
	InputCid            string   `json:"input_cid"`
	OutputCid           string   `json:"output_cid"`
}
