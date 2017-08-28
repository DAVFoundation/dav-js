package main

import (
	"github.com/DAVFoundation/captain/db/models"
	"github.com/DAVFoundation/captain/protocols/vehicle"
	"math/rand"
	"time"
)

func generateVehicleState (message *models.SimulatorMessage) *vehicle.VehicleState {

	vehicleState := vehicle.NewVehicleState()

	batteryLevel := int8(rand.Intn(100))

	vehicleState.BatteryLevel = &batteryLevel

	return vehicleState

}

func generateNextMessage (message *models.SimulatorMessage) *models.SimulatorMessage {

	newMessage := *message

	newMessage.Timestamp = time.Now().Unix() + 1

	return &newMessage

}