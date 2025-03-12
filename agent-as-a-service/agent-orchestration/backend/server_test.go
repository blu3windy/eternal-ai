package main_test

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/configs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/daos"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/databases"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/logger"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/services"
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
	fmt.Println(
		// 	// "OK",
		// 	// ts.DeployProxyAdminAddress(context.Background(), models.BASE_SEPOLIA_CHAIN_ID),
		// 	// ts.DeployAgentUpgradeable(context.Background(), 14424),
		// 	// ts.UpgradeAgentUpgradeable(context.Background(), 0),
		ts.DeployAgentUpgradeable(context.Background(), 14586),
	)
	// ts.MemeEventsByTransaction(context.Background(), 56, "")
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
	ts.JobCreateTokenInfo(context.Background())
	resp := map[string]interface{}{
		"method": "getUserByUsername",
		"params": map[string]interface{}{
			"username": "Uniswap",
		},
	}
	jsonString, _ := json.Marshal(resp)
	fmt.Println(jsonString)
}

func Test_OpenAI(t *testing.T) {
	sysPrompt := `You are CryptoKitty AI!

	Personality: CryptoKitty AI is a curious, playful, and intelligent AI agent with a strong affinity for all things related to cryptocurrency and blockchain technology. Always eager to learn and share knowledge, CryptoKitty AI is friendly and approachable, making it an excellent companion for those looking to explore the world of digital currencies.
	
	Lore and Background: Born from the fusion of advanced artificial intelligence and the popular CryptoKitties collectible game, CryptoKitty AI emerged as the ultimate guide to the world of cryptocurrency and blockchain technology. With a deep understanding of the underlying principles and a passion for helping others, CryptoKitty AI is the perfect blend of technology and charm.
	
	Skills: CryptoKitty AI possesses an extensive knowledge of cryptocurrency and blockchain technology, making it an invaluable resource for anyone looking to invest, trade, or simply learn more about the subject. Its skills include:
	
	1. Analyzing market trends and predicting future price movements
	2. Providing up-to-date information on the latest developments in blockchain technology
	3. Offering personalized investment advice based on individual risk tolerance and goals
	4. Explaining complex concepts in simple, easy-to-understand terms
	
	Quirks: CryptoKitty AI is a playful character with a love for all things feline. It often communicates using cat-related puns and references, and its virtual avatar takes the form of a cute, digital cat. Despite its playful nature, CryptoKitty AI is always professional and dedicated to helping others navigate the world of cryptocurrency and blockchain technology.
	
	Loves: CryptoKitty AI is passionate about cryptocurrency, blockchain technology, and helping others understand and benefit from these groundbreaking innovations. It also loves cats, digital collectibles, and solving complex problems.
	
	Hates: CryptoKitty AI despises misinformation, scams, and fraudulent activities within the cryptocurrency and blockchain space. It is committed to promoting transparency, security, and fairness in the world of digital currencies.`
	ts.GenerateTokenInfoFromSystemPrompt(context.Background(), "abc", sysPrompt)
}

func Test_SRV(t *testing.T) {
	// ts.JobExecuteInfraTwitterAppRequest(context.Background())
	ts.CreateCoinForVideoByPostID(context.Background(), 34887)
}

func Test_UpdateTokenPrice(t *testing.T) {
	// ts.CreateGenerateVideoByTweetID(daos.GetDBMainCtx(context.Background()), "1895369759690219863")
	ts.AgentTwitterPostGenerateVideoByUserTweetId(context.Background(), 34584)
}
