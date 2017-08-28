package config

import (
	"os"
	"strconv"
	"strings"
	"flag"
	"fmt"
)

func LoadString(holder *string, envKey string, flagName string, flagDescription string) {

	envVal := os.Getenv(envKey)

	if envVal != "" {
		*holder = envVal
	}

	flag.StringVar(holder, flagName, *holder, flagDescription)

}

func LoadInt64(holder *int64, envKey string, flagName string, flagDescription string) {

	envVal := os.Getenv(envKey)

	if envVal != "" {
		val, err := strconv.ParseInt(envVal, 10, 64)
		if err != nil {
			val = -1
			fmt.Errorf(err.Error())
		}

		*holder = val
	}

	flag.Int64Var(holder, flagName, *holder, flagDescription)

}

func LoadInt(holder *int, envKey string, flagName string, flagDescription string) {

	envVal := os.Getenv(envKey)

	if envVal != "" {
		val, err := strconv.Atoi(envVal)
		if err != nil {
			val = -1
			fmt.Errorf(err.Error())

		}

		*holder = val
	}

	flag.IntVar(holder, flagName, *holder, flagDescription)

}

func LoadBool(holder *bool, envKey string, flagName string, flagDescription string) {

	envVal := os.Getenv(envKey)

	if envVal != "" {
		switch strings.ToLower(envVal) {
		case "1", "true":
			*holder = true
			break
		default:
			*holder = false
		}
	}

	flag.BoolVar(holder, flagName, *holder, flagDescription)

}
