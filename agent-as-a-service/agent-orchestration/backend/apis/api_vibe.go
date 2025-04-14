package apis

import (
	"net/http"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/serializers"
	"github.com/gin-gonic/gin"
)

func (s *Server) AddVibeWhiteList(c *gin.Context) {
	ctx := s.requestContext(c)
	var req struct {
		Email string `json:"email"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	_ = s.nls.AddVibeWhiteList(ctx, req.Email)
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: true})
}

func (s *Server) VibeValidateReferralCode(c *gin.Context) {
	ctx := s.requestContext(c)
	var req struct {
		RefCode     string `json:"ref_code"`
		UserAddress string `json:"user_address"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	valid, err := s.nls.ValidateReferralCode(ctx, req.RefCode, req.UserAddress)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Result: valid, Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: valid})
}

func (s *Server) AgentComment(c *gin.Context) {
	ctx := s.requestContext(c)
	agentID := s.uintFromContextParam(c, "id")
	req := &serializers.AgentCommentReq{}

	if err := c.ShouldBindJSON(req); err != nil {
		ctxJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}

	userAddress, err := s.getUserAddressFromTK1Token(c)
	if err != nil || userAddress == "" {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(errs.ErrUnAuthorization)})
		return
	}

	resp, err := s.nls.AgentComment(ctx, userAddress, agentID, req)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: resp})
}

func (s *Server) GetListAgentComment(c *gin.Context) {
	ctx := s.requestContext(c)
	page, limit := s.pagingFromContext(c)
	agentID := s.uintFromContextParam(c, "id")
	agentUserComments, err := s.nls.GetListAgentComment(ctx, agentID, page, limit)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: serializers.NewAgentUserCommentArray(agentUserComments)})
}
