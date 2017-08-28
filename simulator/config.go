package main

import (
	"flag"
	"github.com/DAVFoundation/captain/config"
)

func initConfig () {

	config.LoadString(&config.Redis.Host, "REDIS_HOST", "redis-host", "Redis Host")
	config.LoadInt(&config.Redis.Port, "REDIS_PORT", "redis-port", "Redis Port")

	config.LoadString(&config.Log.Threshold, "LOG_THRESHOLD", "log-threshold", "Log level threshold")

	config.LoadString(&config.MissionControl.Host, "MISSION_CONTROL_HOST", "mission-control-host", "Mission Control Host")
	config.LoadInt(&config.MissionControl.Port, "MISSION_CONTROL_PORT", "mission-control-port", "Mission Control Port")

	config.LoadInt(&config.Simulator.WorkerInterval, "SIMULATOR_WORKER_INTERVAL", "simulator-worker-interval", "Simulator Worker Interval")

	flag.Parse()

}
