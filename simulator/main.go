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
	"github.com/DAVFoundation/captain/protocols/registration"
)

var logger = util.GetCurrentPackageLogger()

var statusReportClient *statusreport.StatusReportClient
var registrationClient *registration.RegistrationClient

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

	registrationClient, err = missioncontrol.GetRegistrationClient()

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

func processMessage (msg *models.StatusSimulatorMessage) {

	state := generateVehicleState(msg)

	err := statusReportClient.ReportStatus(msg.VehicleID, state)

	if err != nil {
		logger.Error(err)
		return
	}

	if msg.RegisterVehicle {

		vehicleDetails, err := db.GetVehicleDetails(msg.VehicleID.GetUID())

		if err != nil {
			logger.Error(err)
		} else {

			err = registrationClient.RegisterVehicle(vehicleDetails)

			if err != nil {
				logger.Error(err)
			}

		}

	}

	newMessage := generateNextMessage(msg)

	err = queues.AddSimulatorMessage(*newMessage)

	if err != nil {
		logger.Error(err)
	}

}
