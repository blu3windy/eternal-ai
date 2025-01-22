package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"math/big"
	"os"
	"sync"
	"time"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/core/types"

	"solo/internal/model"
	"solo/internal/port"
	"solo/pkg"
	"solo/pkg/lighthouse"

	"solo/config"
	"solo/pkg/logger"

	"go.uber.org/zap"
)

var TaskChecker = make(map[string]bool)

type miner struct {
	runnerLock   sync.RWMutex
	cnf          *config.Config
	IsStaked     *bool
	currentBlock uint64
	tasksQueue   chan *model.Task

	chain   port.IChain
	staking port.IStaking
	common  port.ICommon
	cluster port.ICluster
}

func NewMiner(chain port.IChain, staking port.IStaking, common port.ICommon, cnf *config.Config, cluster port.ICluster) port.IMiner {
	return &miner{
		staking:    staking,
		chain:      chain,
		common:     common,
		cnf:        cnf,
		cluster:    cluster,
		tasksQueue: make(chan *model.Task, 10),
	}
}

func (t *miner) GetPendingTasks(ctx context.Context) {
	for {
		// logger.AtLog.Info("Waiting task...")

		fBlock := t.common.FromBlock(t.currentBlock)
		tBlock := t.common.ToBlock()

		err := t.chain.GetPendingTasks(ctx, fBlock, tBlock, t.tasksQueue)
		if err != nil {
			if t.cnf.DebugMode {
				logger.GetLoggerInstanceFromContext(ctx).Error("GetPendingTasks",
					zap.Uint64("from_block", fBlock),
					zap.Uint64("to_block", tBlock),
					zap.Error(err),
				)
			}
		}

		t.currentBlock = tBlock
		time.Sleep(time.Second * pkg.TimeToWating)

	}
}

func (t *miner) GetChainCommon() port.ICommon {
	return t.common
}

func (t *miner) GetCluster() port.ICluster {
	return t.cluster
}

func (t *miner) ExecueteTasks(ctx context.Context) {
	for {
		task := <-t.tasksQueue
		if task == nil {
			continue
		}

		s, ok := TaskChecker[task.AssignmentID]
		if ok && s == true {
			logger.GetLoggerInstanceFromContext(ctx).Info("executeTasks.done",
				zap.Any("worker_address", t.common.GetWalletAddres()),
				zap.Any("assigment_id", task.AssignmentID),
				zap.String("inference_id", task.AssignmentID),
			)
			continue
		}

		assigmentID, ok := big.NewInt(0).SetString(task.AssignmentID, 10)
		if !ok {
			continue
		}

		taskResult, err := t.executeTasks(ctx, task)
		if err != nil {
			logger.GetLoggerInstanceFromContext(ctx).Error("executeTasks",
				zap.Any("worker_address", t.common.GetWalletAddres()),
				zap.Any("assigment_id", task.AssignmentID),
				zap.String("inference_id", task.AssignmentID),
				zap.String("task_input", task.Params),
				zap.Error(err),
			)
			continue
		}

		resultData, err := json.Marshal(taskResult)
		if err != nil {
			if t.cnf.DebugMode {
				logger.GetLoggerInstanceFromContext(ctx).Error("executeTasks",
					zap.Any("worker_address", t.common.GetWalletAddres()),
					zap.Any("assigment_id", task.AssignmentID),
					zap.String("inference_id", task.AssignmentID),
					zap.Any("result_data", resultData),
					zap.String("inference_id", task.AssignmentID),
					zap.Error(err))
			}
			continue
		}

		t.chain.SetTask(task)
		tx, err := t.chain.SubmitTask(ctx, assigmentID, resultData)
		if err != nil {
			continue
		}

		logger.GetLoggerInstanceFromContext(ctx).Info("executeTasks",
			zap.Any("worker_address", t.common.GetWalletAddres()),
			zap.Any("assigment_id", task.AssignmentID),
			zap.String("inference_id", task.InferenceID),
			zap.String("result_tx", tx.Hash().Hex()),
		)
		TaskChecker[task.AssignmentID] = true
	}
}

func (t *miner) executeTasks(ctx context.Context, task *model.Task) (*model.TaskResult, error) {
	res := &model.TaskResult{}
	result := []byte{}
	if len(task.BatchInfers) > 0 && task.IsBatch {
		for _, b := range task.BatchInfers {
			seed := pkg.CreateSeed(b.PromptInput, task.TaskID)
			obj, err := t.inferChatCompletions(ctx, b.PromptInput, "", seed)
			if err != nil {
				return nil, err
			}
			_b, err := json.Marshal(obj)
			if err != nil {
				return nil, err
			}
			b.PromptOutput = string(_b)
		}

		objJson, err := json.Marshal(task.BatchInfers)
		if err != nil {
			return nil, err
		}

		result = objJson

	} else {
		seed := pkg.CreateSeed(task.Params, task.TaskID)
		obj, err := t.inferChatCompletions(ctx, task.Params, "", seed)
		if err != nil {
			return nil, err
		}

		objJson, err := json.Marshal(obj)
		if err != nil {
			return nil, err
		}

		result = objJson

	}

	res.Storage = model.LightHouseStorageType
	res.Data = result
	ext := "txt"
	url, err := lighthouse.UploadData(t.cnf.LighthouseKey, fmt.Sprintf("%v_result.%v", task.TaskID, ext), res.Data)
	if err != nil {

		url = "lighthouse-error"
		//return nil, err
	}
	res.ResultURI = "ipfs://" + url
	// logger.GetLoggerInstanceFromContext(ctx).Info("executeTasks", zap.Any("res", res))
	return res, nil
}

func (t *miner) inferChatCompletions(ctx context.Context, prompt string, modelName string, seed uint64) (*model.LLMInferResponse, error) {
	var err error
	key := "InferChatCompletions"
	logs := new([]zap.Field)
	*logs = []zap.Field{
		zap.String("model", modelName),
		zap.String("seed", modelName),
		zap.String("prompt", prompt),
	}
	defer func() {
		if t.cnf.DebugMode {
			if err != nil {
				*logs = append(*logs, zap.Error(err))
				logger.GetLoggerInstanceFromContext(ctx).Error(key, *logs...)
			} else {
				logger.GetLoggerInstanceFromContext(ctx).Info(key, *logs...)
			}
		}
	}()

	_b := []byte(prompt)

	res := &model.LLMInferResponse{}
	infer := &model.LLMInferRequest{}

	err = json.Unmarshal(_b, &infer)
	if err != nil {
		return nil, err
	}

	infer.MaxToken = 512
	infer.Temperature = 0.001
	oldModel := infer.Model
	if t.common.GetConfig().ModelName == "" {
		infer.Model = "hf.co/bartowski/Meta-Llama-3.1-8B-Instruct-GGUF:Q3_K_S"
	} else {
		infer.Model = t.common.GetConfig().ModelName
	}

	url := t.cnf.ApiUrl
	headers := make(map[string]string)
	headers["Content-Type"] = "application/json"
	headers["Authorization"] = fmt.Sprintf("Bearer %s", t.cnf.ApiKey)
	*logs = append(*logs, zap.Any("headers", headers))
	*logs = append(*logs, zap.Any("inferJSON", infer))
	_b, respH, st, err := pkg.HttpRequest(url, "POST", headers, infer)
	if err != nil {
		return nil, err
	}

	*logs = append(*logs, zap.Any("resp_status_code", st))
	*logs = append(*logs, zap.Any("resp_headers", respH))
	*logs = append(*logs, zap.String("resp_body", string(_b)))
	if err = json.Unmarshal(_b, res); err != nil {
		return nil, err
	}

	res.Model = oldModel
	return res, nil
}

func (t *miner) Verify() bool {
	if t.IsStaked != nil && *t.IsStaked {
		return true
	}

	isStake, err := t.staking.IsStaked()
	if err != nil {
		isStake = false
		t.IsStaked = &isStake
		logger.AtLog.Error(err)
	}
	t.IsStaked = &isStake

	return *t.IsStaked
}

func (t *miner) JoinForMinting() (*types.Transaction, error) {
	tx, err := t.staking.JoinForMinting()
	if err != nil {
		logger.GetLoggerInstanceFromContext(context.Background()).Error("JoinForMinting", zap.Error(err))
		return nil, err
	}

	logger.GetLoggerInstanceFromContext(context.Background()).Info("JoinForMinting", zap.String("tx", tx.Hash().Hex()))
	return tx, nil
}

func (t *miner) StakeForWorker() (*types.Transaction, error) {
	tx, err := t.staking.StakeForWorker()
	if err != nil {
		logger.GetLoggerInstanceFromContext(context.Background()).Error("StakeForWorker", zap.Error(err))
		return nil, err
	}
	logger.GetLoggerInstanceFromContext(context.Background()).Info("StakeForWorker", zap.String("tx", tx.Hash().Hex()))
	return tx, nil
}

func (t *miner) MakeVerify() (*types.Transaction, *types.Transaction, error) {

	tx1, err := t.StakeForWorker()
	if err != nil {
		return nil, nil, err
	}

	tx2, err := t.JoinForMinting()
	if err != nil {
		return nil, nil, err
	}

	return tx1, tx2, nil
}

func (t *miner) rejoinForMinting(ctx context.Context) error {
	tx, err := t.staking.JoinForMinting()
	if err != nil {
		// re-join for minting
		logger.GetLoggerInstanceFromContext(ctx).Error("reJoinForMinting",
			zap.String("worker_address", t.common.GetWalletAddres().Hex()),
			zap.Error(err),
		)

		return err
	}

	logger.GetLoggerInstanceFromContext(ctx).Info("reJoinForMinting",
		zap.String("worker_address", t.common.GetWalletAddres().Hex()),
		zap.String("msg", "SUCCESS!!!"),
	)

	_ = tx
	return nil
}

func (t *miner) Info() (*model.MinerInfo, error) {
	currentBlock := t.common.CurrentBlock()

	logFile := fmt.Sprintf(pkg.LOG_INFO_FILE, pkg.CurrentDir())
	stat, err := os.Stat(logFile)
	if stat != nil {
		if stat.ModTime().UTC().Add(time.Minute * 5).Before(time.Now().UTC()) {
			os.Remove(logFile)
		} else {
			_byte, err := os.ReadFile(logFile)
			if err == nil {
				resp := &model.MinerInfo{}
				resp.CurrentBlock = currentBlock
				err = json.Unmarshal(_byte, resp)
				if err == nil {
					return resp, nil
				}
			}
		}
	}

	address := t.common.GetWalletAddres()
	infers, err := t.chain.GetInferenceByMiner()
	if err != nil {
		return nil, err
	}

	proccesedChan := make(chan int)
	balanceChan := make(chan string)
	rewardChan := make(chan string)

	go func(processedChan chan int) {

		processed := 0
		input := make(chan uint64)
		out := make(chan *model.InferInfoChan)
		for i := 1; i <= 8; i++ {
			go t.taskInfo(input, out)
		}

		go func() {
			for _, infer := range infers {
				input <- infer.Uint64()
			}
			close(input)
		}()

		for range infers {
			outFChan := <-out
			if outFChan.Err != nil {
				continue
			}

			if len(outFChan.Data.Output) > 0 {
				processed++
			}
		}

		processedChan <- processed

	}(proccesedChan)

	go func(balanceChan chan string) {
		blaStr := "0"
		balance, err := t.common.Erc20Balance()
		if err == nil {
			blaStr = balance.String()
		}

		balanceChan <- blaStr
	}(balanceChan)

	go func(rewardChan chan string) {
		rewardStr := ""
		reward, err := t.staking.RewardToClaim(&bind.CallOpts{
			From: t.common.GetWalletAddres(),
		})
		if err == nil {
			rewardStr = reward.String()
		}

		rewardChan <- rewardStr
	}(rewardChan)

	resp := &model.MinerInfo{
		Address:        address.Hex(),
		Tasks:          len(infers),
		ProcessedTasks: <-proccesedChan,
		ModelName:      t.cnf.ModelName,
		Balance:        <-balanceChan,
		Reward:         <-rewardChan,
		ClusterID:      t.cnf.ClusterID,
	}
	_byte, err := json.Marshal(resp)
	if err == nil {
		pkg.CreateFile(logFile, _byte)
	}

	resp.CurrentBlock = currentBlock
	return resp, nil
}

func (t *miner) taskInfo(input chan uint64, out chan *model.InferInfoChan) {

	for i := range input {
		inferInfo, err := t.chain.GetInferenceInfo(nil, i)
		out <- &model.InferInfoChan{
			Err:  err,
			Data: inferInfo,
		}
	}

}

func (t *miner) ClaimReward() (*types.Transaction, error) {
	return t.staking.ClaimReward()
}

func (t *miner) GetConfig() *config.Config {
	return t.cnf
}
