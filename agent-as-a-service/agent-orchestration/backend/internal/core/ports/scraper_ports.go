package ports

import "context"

type IScraper interface {
	ContentHtmlByUrl(ctx context.Context, url string) (string, error)
}
