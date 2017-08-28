package main

import (
	"github.com/DAVFoundation/captain/missioncontrol"
	"github.com/DAVFoundation/captain/db"
	"github.com/DAVFoundation/captain/db/queues"
	"github.com/DAVFoundation/captain/util"
	"github.com/DAVFoundation/captain/db/models"
	"github.com/DAVFoundation/captain/protocols/statusreport"
	"time"
	"github.com/DAVFoundation/captain/config"
)

var logger = util.GetCurrentPackageLogger()

var statusReportClient *statusreport.StatusReportClient

func main () {

	initConfig()

	err := db.Init()

	if err != nil {
		panic(err)
	}

	statusReportClient, err = missioncontrol.GetStatusReportClient()

	if err != nil {
		panic(err)
	}

	for {

		doWork()

		time.Sleep(time.Millisecond * time.Duration(config.Simulator.WorkerInterval))

	}

}

func doWork() {

	msg, err := queues.PollSimulatorMessage()

	if err != nil {
		logger.Error(err)
		return
	}

	if msg.Timestamp > time.Now().Unix() {
		queues.AddSimulatorMessage(*msg)
	} else {
		processMessage(msg)
	}

}

func processMessage (msg *models.SimulatorMessage) {

	state := generateVehicleState(msg)

	err := statusReportClient.ReportStatus(msg.VehicleID, state)

	newMessage := generateNextMessage(msg)

	err = queues.AddSimulatorMessage(*newMessage)

	if err != nil {
		logger.Error(err)
	}

}
