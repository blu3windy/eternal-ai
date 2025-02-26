package main

import (
	"flag"
	"solo/internal/delivery/http"
	"solo/internal/factory"
	"strconv"
)

func main() {
	port := ""
	flag.StringVar(&port, "port", "9000", "Config file path")
	flag.Parse()

	portInt, err := strconv.Atoi(port)
	if err != nil {
		panic(err)
	}

	initObject, _ := factory.NewAPI(portInt)
	api := initObject.API
	_cmd, _ := http.NewHttp(api, api.GetPort())
	_cmd.Run()
}
