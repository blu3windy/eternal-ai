package main_test

import (
	"context"
	"crypto/tls"
	"fmt"
	"net/http"
	"testing"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/configs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/daos"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/databases"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/logger"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/types/numeric"
)

var ts *services.Service

func init() {
	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}
	conf := configs.GetConfig()
	logger.NewLogger("agents-ai-api", conf.Env, "", true)
	defer logger.Sync()
	dbMain, err := databases.Init(
		conf.DbURL,
		nil,
		1,
		20,
		conf.Debug,
	)
	if err != nil {
		panic(err)
	}
	daos.InitDBConn(
		dbMain,
	)
	var (
		s = services.NewService(
			conf,
		)
	)
	ts = s
}

func Test_JOB(t *testing.T) {
	ts.MemeEventsByTransaction(context.Background(), 33139, "0xa9c5a7718f9919f311a2b554cdf756da198dfe371a8c3879ba3626c1c33d823a")
	// ts.AgentSnapshotPostCreate(context.Background(), 59166, "", "")
	// ts.JobScanAgentTwitterPostForTA(context.Background())
	// ts.RetryAgentDeployToken(context.Background(), 51265)
	// ts.JobUpdateOffchainAutoOutputForMission(context.Background())
	// ts.JobAgentTwitterPostTA(context.Background())
	// ts.JobLuckyMoneyProcessUserReward(context.Background())

	// fmt.Println(
	// // ts.DeployDAOTreasuryLogic(context.Background(), models.BASE_CHAIN_ID),
	// // ts.DeployDAOTreasuryAddress(context.Background(), models.BASE_CHAIN_ID),
	// // ts.AgentAddLiquidityDAOToken(context.Background(), 1),
	// // ts.CreateSOLAddress(context.Background()),
	// // ts.CreateETHAddress(context.Background()),
	// // ts.JobAgentTgeTransferDAOToken(context.Background()),
	// // ts.JobAgentAddLiquidityDAOToken(context.Background()),
	// // ts.DeployDAOTreasuryLogic(context.Background(), models.BASE_CHAIN_ID),
	// // ts.JobAgentTgeTransferDAOToken(context.Background()),
	// )
	// select {}
}

func Test_UTIL(t *testing.T) {
	// ts.JobScanRepliesByLaunchpadTweetID(context.Background())
	// ts.AgentStoreGetTokenInfo(context.Background(), "", 9)

	fmt.Println(ts.DeployAgentRealWorldAddress(
		context.Background(),
		models.BASE_CHAIN_ID,
		"RWTST",
		"RWTST",
		numeric.NewFloatFromString("1000000000"),
		numeric.NewFloatFromString("0.000001"),
		"0x792FAB59D60D8F5a13E9D39dB9a6c6B37EAd0E64",
	))
}

func Test_SRV(t *testing.T) {
	ts.JobScanAgentTwitterPostForCreateLaunchpad(context.Background())
	// ts.AgentTwitterPostCreateLaunchpad(context.Background(), 34285)
}
