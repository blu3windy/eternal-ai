package main

import (
	"context"
	"go.uber.org/zap"
	"os"
	"solo/config"
	"solo/internal/factory"
	"solo/internal/port"
	"solo/pkg/logger"
	"testing"
)

var configFile = ""

func logTest(t *testing.T, resp interface{}, err error) {
	if err != nil {
		t.Error(err)
		return
	}

	t.Log(resp)
}

func createApi() (port.IApi, error) {
	// init flag
	configFile = os.Getenv("CNF_FILE_TEST")

	cnf, err := config.ReadConfig(configFile)
	if err != nil {
		logger.AtLog.Fatal(err)
		return nil, err
	}

	logger.GetLoggerInstanceFromContext(context.Background()).Info("ReadConfig",
		zap.Any("cfg", cnf),
	)

	err = cnf.Verify()
	if err != nil {
		logger.AtLog.Fatal(err)
		return nil, err
	}

	obj, err := factory.NewMiner(cnf)
	if err != nil {
		logger.AtLog.Fatal(err)
		return nil, err
	}

	return obj.API, nil
}
