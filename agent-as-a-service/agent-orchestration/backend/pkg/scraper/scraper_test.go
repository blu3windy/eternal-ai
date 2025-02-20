package scraper

import (
	"context"
	"fmt"
	"html"
	"sync"
	"testing"

	"github.com/davecgh/go-spew/spew"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/internal/core/ports"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/logger"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/pkg/utils"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services/3rd/lighthouse"
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
	logger.NewLogger("agents-ai-api", "test", "", true)
	s.ctx = context.Background()
}

func (s *Suite) TestContentHtmlByUrl() {
	var err error

	mainW := &sync.WaitGroup{}

	mainW.Add(1)
	s.scraper, err = NewScraper("https://go-colly.org/", 2)
	if err != nil {
		panic(err)
	}

	outChan := s.scraper.FetchLinksFromDomain(s.ctx, mainW)
	for l := range outChan {
		l = "https://support.ethdenver.com/hc/en-us/categories/16968688290971-Top-Questions"
		fmt.Sprintf("url: %s", l)
		content, err := s.scraper.ContentHtmlByUrl(s.ctx, l)
		if err != nil {
			panic(err)
		}

		bytes := []byte(html.EscapeString(content))
		hash, err := lighthouse.UploadDataWithRetry("da69db7d.010ffac15c0f4081a938b9446f599e14", utils.FileNameFromUrl(l), bytes)
		spew.Dump(hash)
		spew.Dump(err)
		panic(1)
	}
	mainW.Wait()
}
