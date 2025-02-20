package colly

import (
	"context"
	"testing"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/internal/core/ports"
	"github.com/stretchr/testify/suite"
)

type Suite struct {
	suite.Suite
	ctx     context.Context
	scraper ports.IScraper
}

func TestRun(t *testing.T) {
	suite.Run(t, new(Suite))
}

func (s *Suite) SetupSuite() {
	var err error
	s.ctx = context.Background()
	s.scraper, err = NewScraper(s.ctx)
	if err != nil {
		panic(err)
	}
}

func (s *Suite) TestContentHtmlByUrl() {
	url := "https://www.nbcnews.com/"
	s.scraper.ContentHtmlByUrl(s.ctx, url)
}
