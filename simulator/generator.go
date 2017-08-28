package main

import (
	"github.com/DAVFoundation/captain/db/models"
	"github.com/DAVFoundation/captain/protocols/vehicle"
	"math/rand"
	"time"
)

func generateVehicleState (message *models.StatusSimulatorMessage) *vehicle.VehicleState {

	vehicleState := vehicle.NewVehicleState()

	batteryLevel := int8(rand.Intn(100))

	vehicleState.MissionStatus = message.MissionStatus

	vehicleState.BatteryLevel = &batteryLevel

	return vehicleState

}

func generateNextMessage (message *models.StatusSimulatorMessage) *models.StatusSimulatorMessage {

	newMessage := *message

	message.RegisterVehicle = false

	var timestamp = time.Now().Unix()

	switch *message.MissionStatus {
	case "available_for_missions":
		timestamp += 60
		break
	case "on_a_mission":
		timestamp += 1
		break
	}

	newMessage.Timestamp = timestamp

	return &newMessage

}