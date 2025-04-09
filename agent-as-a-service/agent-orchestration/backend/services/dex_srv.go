package services

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/daos"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/helpers"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services/3rd/dexscreener"
	"github.com/jinzhu/gorm"
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

func (s *Service) JobUpdateTrendingTokens(ctx context.Context) error {
	return s.JobRunCheck(
		ctx,
		"JobUpdateTrendingTokens",
		func() error {
			// Get trending tokens from Moralis
			tokens, err := s.moralisClient.GetTrendingTokens("solana")
			if err != nil {
				return fmt.Errorf("failed to get trending tokens: %v", err)
			}

			// Use transaction helper
			return daos.WithTransaction(
				daos.GetDBMainCtx(ctx),
				func(tx *gorm.DB) error {
					// Delete all existing records
					if err := tx.Unscoped().Delete(&models.TrendingToken{}).Error; err != nil {
						return errs.NewError(err)
					}

					// Process each token
					for _, token := range tokens {
						// Convert CreatedAt int64 timestamp to time.Time
						mintAt := time.Unix(token.CreatedAt, 0)

						trendingToken := &models.TrendingToken{
							ChainId:      token.ChainId,
							TokenAddress: token.TokenAddress,
							Name:         token.Name,
							Symbol:       token.Symbol,
							Decimals:     token.Decimals,
							Logo:         token.Logo,
							UsdPrice:     token.UsdPrice,
							MarketCap:    token.MarketCap,
							LiquidityUsd: token.LiquidityUsd,
							Holders:      token.Holders,
							MintAt:       &mintAt,
							// Price changes
							PriceChange1h:  token.PricePercentChange.OneHour,
							PriceChange4h:  token.PricePercentChange.FourHour,
							PriceChange12h: token.PricePercentChange.TwelveHour,
							PriceChange24h: token.PricePercentChange.TwentyFourHour,

							// Volumes
							Volume1h:  token.TotalVolume.OneHour,
							Volume4h:  token.TotalVolume.FourHour,
							Volume12h: token.TotalVolume.TwelveHour,
							Volume24h: token.TotalVolume.TwentyFourHour,

							// Transactions
							Transactions1h:  int(token.Transactions.OneHour),
							Transactions4h:  int(token.Transactions.FourHour),
							Transactions12h: int(token.Transactions.TwelveHour),
							Transactions24h: int(token.Transactions.TwentyFourHour),

							// Buy transactions
							BuyTransactions1h:  int(token.BuyTransactions.OneHour),
							BuyTransactions4h:  int(token.BuyTransactions.FourHour),
							BuyTransactions12h: int(token.BuyTransactions.TwelveHour),
							BuyTransactions24h: int(token.BuyTransactions.TwentyFourHour),

							// Sell transactions
							SellTransactions1h:  int(token.SellTransactions.OneHour),
							SellTransactions4h:  int(token.SellTransactions.FourHour),
							SellTransactions12h: int(token.SellTransactions.TwelveHour),
							SellTransactions24h: int(token.SellTransactions.TwentyFourHour),

							// Buyers
							Buyers1h:  int(token.Buyers.OneHour),
							Buyers4h:  int(token.Buyers.FourHour),
							Buyers12h: int(token.Buyers.TwelveHour),
							Buyers24h: int(token.Buyers.TwentyFourHour),

							// Sellers
							Sellers1h:  int(token.Sellers.OneHour),
							Sellers4h:  int(token.Sellers.FourHour),
							Sellers12h: int(token.Sellers.TwelveHour),
							Sellers24h: int(token.Sellers.TwentyFourHour),
						}

						// Create new token
						if err := tx.Create(trendingToken).Error; err != nil {
							return errs.NewError(err)
						}
					}

					return nil
				},
			)
		},
	)
}
