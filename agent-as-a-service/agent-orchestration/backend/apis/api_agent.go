package apis

import (
	"net/http"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/helpers"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/serializers"
	"github.com/gin-gonic/gin"
)

func (s *Server) GetListAgent(c *gin.Context) {
	ctx := s.requestContext(c)
	page, limit := s.pagingFromContext(c)
	chain := s.chainFromContextQuery(c)
	creator := s.stringFromContextQuery(c, "creator")
	kw := s.stringFromContextQuery(c, "keyword")
	agentTypes, err := s.uintArrayFromContextQuery(c, "agent_type")
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}

	kbStatus, err := s.uint64FromContextQuery(c, "kb_status")
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}

	ms, count, err := s.nls.GetListAgentInfos(ctx, chain, creator, agentTypes, int64(kbStatus), kw, page, limit)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: serializers.NewAgentInfoRespArry(ms), Count: &count})
}

func (s *Server) GetListAgentUnClaimed(c *gin.Context) {
	ctx := s.requestContext(c)
	page, limit := s.pagingFromContext(c)
	search := s.stringFromContextQuery(c, "search")
	ms, count, err := s.nls.GetListAgentUnClaimed(ctx, search, page, limit)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: serializers.NewAgentInfoRespArry(ms), Count: &count})
}

func (s *Server) GetListAgentForDojo(c *gin.Context) {
	ctx := s.requestContext(c)
	page, limit := s.pagingFromContext(c)
	chain := s.chainFromContextQuery(c)
	creator := s.stringFromContextQuery(c, "creator")
	agentTypes, err := s.uintArrayFromContextQuery(c, "agent_type")
	kw := s.stringFromContextQuery(c, "keyword")
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}

	kbStatus, err := s.uint64FromContextQuery(c, "kb_status")
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}

	ms, count, err := s.nls.GetListAgentInfos(ctx, chain, creator, agentTypes, int64(kbStatus), kw, page, limit)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: serializers.NewAssistantRespArry(ms), Count: &count})
}

func (s *Server) GetAgentDetail(c *gin.Context) {
	ctx := s.requestContext(c)
	agentID := s.stringFromContextParam(c, "id")
	chain := s.chainFromContextQuery(c)
	ms, err := s.nls.GetAgentInfoDetail(ctx, chain, agentID)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: serializers.NewAgentInfoResp(ms)})
}

func (s *Server) GetAgentDetailByAgentID(c *gin.Context) {
	ctx := s.requestContext(c)
	agentID := s.stringFromContextParam(c, "id")
	ms, err := s.nls.SyncAgentInfoDetailByAgentID(ctx, agentID)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	estimateTime, err := s.nls.GetEstimateTime(ctx, ms)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	result := serializers.NewAgentInfoResp(ms)
	result.EstimateTwinDoneTimestamp = estimateTime
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: result})
}

func (s *Server) GetAgentDetailByAgentIDForDojo(c *gin.Context) {
	ctx := s.requestContext(c)
	agentID := s.stringFromContextParam(c, "id")
	ms, err := s.nls.SyncAgentInfoDetailByAgentID(ctx, agentID)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	estimateTime, err := s.nls.GetEstimateTime(ctx, ms)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}

	result := serializers.NewAssistantResp(ms)
	result.AgentInfo.EstimateTwinDoneTimestamp = estimateTime
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: result})
}

func (s *Server) AdminGetAgentDetailByAgentID(c *gin.Context) {
	ctx := s.requestContext(c)
	agentID := s.stringFromContextParam(c, "id")
	ms, err := s.nls.SyncAgentInfoDetailByAgentID(ctx, agentID)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	agentInfo := &models.AgentInfoResponse{}
	if err = helpers.Copy(agentInfo, ms); err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	data, err := s.nls.FindAgentSnapshotMission(ctx, ms.ID)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	missions := []*models.AgentSnapshotMissionResp{}
	if err = helpers.Copy(&missions, data); err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}

	agentInfo.AgentSnapshotMissions = missions
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: agentInfo})
}

func (s *Server) AdminGetSnapshotPostActionByAgent(c *gin.Context) {
	ctx := s.requestContext(c)
	username := s.stringFromContextQuery(c, "twitter_username")
	ms, err := s.nls.FindAgenByTwitterUsername(ctx, username)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	agentInfo := &models.AgentInfoWithSnapshotPostActionsResponse{}
	if err = helpers.Copy(agentInfo, ms); err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}

	data, err := s.nls.FindAgentSnapshotPostAction(ctx, ms.ID)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	actions := []*models.AgentSnapshotPostActionResp{}
	if err = helpers.Copy(&actions, data); err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}

	agentInfo.AgentSnapshotPostAction = actions
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: agentInfo})
}

func (s *Server) GetAgentDetailByContract(c *gin.Context) {
	ctx := s.requestContext(c)
	chain := s.chainFromContextQuery(c)
	agentContractID := s.stringFromContextParam(c, "id")
	agentContractAddress := s.stringFromContextParam(c, "address")
	ms, err := s.nls.GetAgentInfoDetailByContract(ctx, chain, agentContractID, agentContractAddress)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: serializers.NewAgentInfoResp(ms)})
}

func (s *Server) UpdateAgentFarcaster(c *gin.Context) {
	ctx := s.requestContext(c)
	var req serializers.AgentTwitterInfoReq
	if err := c.ShouldBindJSON(&req); err != nil {
		ctxJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}

	agentID := s.stringFromContextParam(c, "id")
	resp, err := s.nls.UpdateAgentFarcasterInfo(ctx, agentID, req.FarcasterID, req.FarcasterUsername)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: resp})
}

func (s *Server) GetListAgentTwitterPost(c *gin.Context) {
	ctx := s.requestContext(c)
	page, limit := s.pagingFromContext(c)
	chain := s.chainFromContextQuery(c)
	ms, count, err := s.nls.GetListAgentTwitterPost(ctx, chain, page, limit)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: serializers.NewAgentTwitterPostRespArry(ms), Count: &count})
}

func (s *Server) GetAgentTwitterPostDetail(c *gin.Context) {
	ctx := s.requestContext(c)
	postID := s.uintFromContextParam(c, "id")
	ms, err := s.nls.GetAgentTwitterPostDetail(ctx, postID)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: serializers.NewAgentTwitterPostResp(ms)})
}

func (s *Server) GetListAgentEaiTopup(c *gin.Context) {
	ctx := s.requestContext(c)
	page, limit := s.pagingFromContext(c)
	agentID := s.stringFromContextParam(c, "id")
	ms, count, err := s.nls.GetListAgentEaiTopup(ctx, agentID, s.stringFromContextQuery(c, "type"), page, limit)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: serializers.NewAgentEaiTopupRespArry(ms), Count: &count})
}

func (s *Server) PreviewAgentSystemPromp(c *gin.Context) {
	ctx := s.requestContext(c)
	var req struct {
		Personality string `json:"personality"`
		Question    string `json:"question"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		ctxJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}

	resp, err := s.nls.PreviewAgentSystemPromp(ctx, req.Personality, req.Question)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: resp})
}

func (s *Server) PreviewAgentSystemPrompV1(c *gin.Context) {
	ctx := s.requestContext(c)
	var req struct {
		Messages string  `json:"messages"`
		AgentID  *uint   `json:"agent_id"`
		KbId     *string `json:"kb_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		ctxJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}

	resp, err := s.nls.PreviewAgentSystemPrompV1(ctx, req.Messages, req.AgentID, req.KbId)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: resp})
}

func (s *Server) AgentChatSupport(c *gin.Context) {
	ctx := s.requestContext(c)
	var req struct {
		Message string `json:"message"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		ctxJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}

	resp, err := s.nls.AgentChatSupport(ctx, req.Message)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: resp})
}

func (s *Server) GetAgentBrainHistory(c *gin.Context) {
	ctx := s.requestContext(c)
	page, limit := s.pagingFromContext(c)
	agentContractID := s.stringFromContextParam(c, "id")
	postID := s.uintFromContextQuery(c, "post_id")
	ms, count, err := s.nls.GetAgentBrainHistory(ctx, agentContractID, postID, page, limit)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: serializers.NewAgentSnapshotPostRespArry(ms), Count: &count})
}

// ///
func (s *Server) CreateUpdateAgentSnapshotMission(c *gin.Context) {
	ctx := s.requestContext(c)
	var req []*serializers.AgentSnapshotMissionInfo
	if err := c.ShouldBindJSON(&req); err != nil {
		ctxJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	authHeader := c.GetHeader("Authorization")
	agentID := s.stringFromContextParam(c, "id")
	resp, err := s.nls.CreateUpdateAgentSnapshotMission(ctx, agentID, authHeader, req)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: serializers.NewAgentInfoResp(resp)})
}

func (s *Server) DeleteAgentSnapshotMission(c *gin.Context) {
	ctx := s.requestContext(c)
	userAddress, err := s.getUserAddressFromTK1Token(c)
	if err != nil || userAddress == "" {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(errs.ErrUnAuthorization)})
		return
	}
	missionID := s.uintFromContextParam(c, "id")
	resp, err := s.nls.DeleteAgentSnapshotMission(ctx, missionID, userAddress)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: resp})
}

func (s *Server) GetBrainDetailByTweetID(c *gin.Context) {
	ctx := s.requestContext(c)
	tweetID := s.stringFromContextParam(c, "id")
	ms, err := s.nls.GetBrainDetailByTweetID(ctx, tweetID)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: serializers.NewAgentSnapshotPostResp(ms)})
}

// //
func (s *Server) UnlinkAgentTwitterInfo(c *gin.Context) {
	ctx := s.requestContext(c)
	agentID := s.stringFromContextParam(c, "id")
	resp, err := s.nls.UnlinkAgentTwitterInfo(ctx, agentID)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: resp})
}

func (s *Server) GetDashBoardAgent(c *gin.Context) {
	ctx := s.requestContext(c)
	page, limit := s.pagingFromContext(c)
	chain := s.chainFromContextQuery(c)
	sortStr := s.agentSortListFromContext(c)
	search := s.stringFromContextQuery(c, "search")
	ms, count, err := s.nls.GetDashboardAgentInfos(ctx, chain, "", search, sortStr, page, limit)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: serializers.NewAgentInfoRespArry(ms), Count: &count})
}

func (s *Server) GetDashBoardAgentDetail(c *gin.Context) {
	ctx := s.requestContext(c)
	page, limit := s.pagingFromContext(c)
	chain := s.chainFromContextQuery(c)
	sortStr := s.agentSortListFromContext(c)
	search := s.stringFromContextQuery(c, "search")
	tokenAddress := s.stringFromContextParam(c, "token_address")
	if tokenAddress == "" {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(errs.ErrBadRequest)})
		return
	}
	ms, _, err := s.nls.GetDashboardAgentInfos(ctx, chain, tokenAddress, search, sortStr, page, limit)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	if len(ms) > 0 {
		ctxJSON(c, http.StatusOK, &serializers.Resp{Result: serializers.NewAgentInfoResp(ms[0])})
		return
	}
	ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(errs.ErrTokenNotFound)})
	return
}

func (s *Server) GetTokenInfoByContract(c *gin.Context) {
	ctx := s.requestContext(c)
	tokenAddress := s.stringFromContextParam(c, "id")
	ms, err := s.nls.GetTokenInfoByContract(ctx, tokenAddress)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: ms})
}

func (s *Server) GetAgentMissionConfigs(c *gin.Context) {
	ctx := s.requestContext(c)
	chainID := s.chainFromContextQuery(c)
	platform := s.stringFromContextQuery(c, "platform")
	ms, err := s.nls.GetAgentSnapshotMissionConfigs(ctx, chainID, platform)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: serializers.NewAgentSnapshotMissionConfigsRespArry(ms)})
}

func (s *Server) GetAgentMissionTokens(c *gin.Context) {
	ctx := s.requestContext(c)
	rs, err := s.nls.GetAgentSnapshotMissionTokens(ctx)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: rs})
}

// /////
func (s *Server) AgentChats(c *gin.Context) {
	ctx := s.requestContext(c)
	var req serializers.AgentChatMessageReq
	if err := c.ShouldBindJSON(&req); err != nil {
		ctxJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}

	agentID := s.stringFromContextParam(c, "id")
	resp, err := s.nls.AgentChats(ctx, agentID, req)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: resp})
}

func (s *Server) PauseAgent(c *gin.Context) {
	ctx := s.requestContext(c)
	agentID := s.stringFromContextParam(c, "id")
	resp, err := s.nls.PauseAgent(ctx, agentID)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: resp})
}

func (s *Server) UpdateAgentExternalInfo(c *gin.Context) {
	ctx := s.requestContext(c)
	var req serializers.AgentExternalInfoReq
	if err := c.ShouldBindJSON(&req); err != nil {
		ctxJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}

	agentID := s.stringFromContextParam(c, "id")
	resp, err := s.nls.UpdateAgentExternalInfo(ctx, agentID, &req)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: resp})
}

func (s *Server) GetAgentSummaryReport(c *gin.Context) {
	ctx := s.requestContext(c)
	ms, err := s.nls.GetAgentSummaryReport(ctx)
	if err != nil {
		ctxAbortWithStatusJSON(c, http.StatusBadRequest, &serializers.Resp{Error: errs.NewError(err)})
		return
	}
	ctxJSON(c, http.StatusOK, &serializers.Resp{Result: serializers.NewAgentReportRespArr(ms)})
}
