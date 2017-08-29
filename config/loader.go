package config

// Helper functions to load configurations from program arguments with fallback to environment variables

import (
	"os"
	"strconv"
	"strings"
	"flag"
	"fmt"
)

// Loads string value from program argument with fallback to environment variable
// expects parameters:
// 	- holder: a pointer to the parameter value holder
// 	- envKey: the name of the environment variable to look for the value in
//  - flagName: the program argument name to expect
//	- flagDescription: will be printed out in the package help output
func LoadString(holder *string, envKey string, flagName string, flagDescription string) {

	envVal := os.Getenv(envKey)

	if envVal != "" {
		*holder = envVal
	}

	flag.StringVar(holder, flagName, *holder, flagDescription)

}

// Loads int64 value from program argument with fallback to environment variable
// expects parameters:
// 	- holder: a pointer to the parameter value holder
// 	- envKey: the name of the environment variable to look for the value in
//  - flagName: the program argument name to expect
//	- flagDescription: will be printed out in the package help output
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

// Loads int value from program argument with fallback to environment variable
// expects parameters:
// 	- holder: a pointer to the parameter value holder
// 	- envKey: the name of the environment variable to look for the value in
//  - flagName: the program argument name to expect
//	- flagDescription: will be printed out in the package help output
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

// Loads bool value from program argument with fallback to environment variable
// expects parameters:
// 	- holder: a pointer to the parameter value holder
// 	- envKey: the name of the environment variable to look for the value in
//  - flagName: the program argument name to expect
//	- flagDescription: will be printed out in the package help output
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
