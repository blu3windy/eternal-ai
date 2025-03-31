package apis

import (
	"net/http"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/serializers"
	"github.com/gin-gonic/gin"
)

func (s *Server) GenerateRobotSaleWallet(c *gin.Context) {
	ctx := s.requestContext(c)
	var req serializers.RobotSaleWalletReq
	if err := c.ShouldBindJSON(&req); err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}

	robotSaleWallet, err := s.nls.GenerateRobotSaleWallet(ctx, req.ProjectID, req.UserAddress)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: serializers.NewRobotSaleWalletResp(robotSaleWallet)})
}

func (s *Server) GetRobotSaleWallet(c *gin.Context) {
	ctx := s.requestContext(c)
	projectID := s.stringFromContextQuery(c, "project_id")
	userAddress := s.stringFromContextQuery(c, "user_address")
	robotSaleWallet, err := s.nls.GetRobotSaleWallet(ctx, projectID, userAddress)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: serializers.NewRobotSaleWalletResp(robotSaleWallet)})
}
