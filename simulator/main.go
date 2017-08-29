package main

// captain-simulation-worker entry point. captain-simulation-worker processes status simulation queue messages,
// generating vehicle states and reports mission control

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
	"github.com/garyburd/redigo/redis"
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

	for {

		err = doWork()

		if err != nil {
			logger.Error(err)
		}

		time.Sleep(time.Millisecond * time.Duration(config.Simulator.WorkerInterval))

	}

}

// every iteration of the queue worker polls a message from the queue and checks whether it's the time for processing it
// and processes it. otherwise the message is returned to the queue
func doWork() (err error) {

	if statusReportClient == nil || !statusReportClient.Transport.IsOpen() {

		statusReportClient, err = missioncontrol.GetStatusReportClient()

		if err != nil {
			return err
		}

	}

	if registrationClient == nil || !registrationClient.Transport.IsOpen() {

		registrationClient, err = missioncontrol.GetRegistrationClient()

		if err != nil {
			return err
		}

	}

	msg, err := queues.PollSimulatorMessage()

	if err != nil {
		if err == redis.ErrNil {
			logger.Info("queue is empty")
			return nil
		} else {
			return err
		}
	}

	if msg.Timestamp > time.Now().Unix() {
		err = queues.AddSimulatorMessage(*msg)
	} else {
		err = processMessage(msg)
	}

	return err
}

// message process:
//	- generates a simulated state for the vehicle described in the message
//	- reports the simulated state to mission control
//	- if ordered, registers vehicle for missions in mission control
//	- generates the next message and adding it to the queue
func processMessage (msg *models.StatusSimulatorMessage) error {

	state := generateVehicleState(msg)

	err := statusReportClient.ReportStatus(msg.VehicleID, state)

	if err != nil {
		logger.Error(err)
		return err
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
		return err
	}

	return nil

}
