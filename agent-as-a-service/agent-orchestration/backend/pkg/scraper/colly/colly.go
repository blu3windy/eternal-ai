package colly

import (
	"context"
	"fmt"
	"net/http"

	"github.com/davecgh/go-spew/spew"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/internal/core/ports"
	"github.com/gocolly/colly"
)

var tracerTagName = "scraper-colly"

type scraper struct {
	collyCollector *colly.Collector
	ctx            context.Context
	url            string
	htmlStr        string
	maxDepth       int
}

func NewScraper(ctx context.Context) (ports.IScraper, error) {
	s := &scraper{ctx: ctx}
	s.maxDepth = 1
	s.setCallback()
	return s, nil
}

func (s *scraper) setCallback() {
	c := colly.NewCollector(
		colly.MaxDepth(s.maxDepth),
		colly.AllowedDomains("nbcnews.com", "www.nbcnews.com"))

	c.WithTransport(&http.Transport{
		DisableKeepAlives: true,
	})

	c.OnRequest(func(r *colly.Request) {
		// logger.Info(tracerTagName, "visiting", zap.Any("url", r.URL.String()))
	})

	c.OnError(func(r *colly.Response, err error) {
		// logger.Error(tracerTagName, "scraper_error", zap.Error(err), zap.Any("request_url", r.Request.URL), zap.Any("failed with response", r))
		spew.Dump(err)
	})

	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		link := e.Attr("href")
		// Print link
		fmt.Printf("Link found: %q -> %s\n", e.Text, link)
		// Visit link found on page
		// Only those links are visited which are in AllowedDomains
		c.Visit(e.Request.AbsoluteURL(link))
	})

	// c.OnRequest(func(r *colly.Request) {
	// 	fmt.Println("Visiting", r.URL.String())
	// })
	s.collyCollector = c
}

func (s *scraper) ContentHtmlByUrl(ctx context.Context, url string) (string, error) {
	s.url = url
	req := &colly.Request{}
	if err := s.collyCollector.Visit(req.AbsoluteURL(s.url)); err != nil {
		return "", err
	}
	return "", nil
}
