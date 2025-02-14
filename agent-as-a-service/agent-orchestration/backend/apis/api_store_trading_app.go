package apis

import (
	"net/http"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/serializers"
	"github.com/gin-gonic/gin"
)

func (s *Server) StoreDefiAppAuthenInstall(c *gin.Context) {
	ctx := s.requestContext(c)
	authUrl, err := s.nls.StoreDefiAppAuthenInstall(ctx, s.stringFromContextQuery(c, "install_code"), s.stringFromContextQuery(c, "install_uri"))
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	c.Redirect(http.StatusFound, authUrl)
}

func (s *Server) StoreDefiAppGetWallet(c *gin.Context) {
	ctx := s.requestContext(c)
	address, err := s.nls.StoreDefiAppGetWallet(ctx, c.GetHeader("api-key"))
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: address})
}
