package services

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/helpers"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services/3rd/dexscreener"
)

// call dexscreener api
func (s *Service) CallWssDexScreener() {
	client := dexscreener.NewDexScreenerClient(true)

	client.OnPair(func(pair dexscreener.Pair) {
		data, _ := json.Marshal(pair)
		fmt.Printf("Received pair: %s\n", string(data))
	})

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Handle graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		<-sigChan
		cancel()
	}()

	if err := client.Connect(ctx, "trendingScoreH24"); err != nil {
		log.Fatalf("Failed to connect: %v", err)
	}

	// Wait for context cancellation
	<-ctx.Done()
	client.Close()
}

func (s *Service) TestCrawlDexScreener(ctx context.Context) {
	link := "https://dexscreener.com/solana?rankBy=trendingScoreH24&order=desc"
	txt := helpers.RodContentHtmlByUrlV2(link)
	fmt.Printf("Crawled dexscreener: %s\n", txt)

}
