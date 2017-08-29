package handlers

// handler of VehicleCreation service that is being used by Mission Control

import (
	"github.com/DAVFoundation/captain/protocols/vehicle"
	"github.com/DAVFoundation/captain/db"
	"github.com/DAVFoundation/captain/db/models"
	"time"
	"github.com/DAVFoundation/captain/db/queues"
)

type VehicleCreationHandler struct {

}

func NewVehicleCreationHandler() *VehicleCreationHandler {
	return &VehicleCreationHandler{}
}

// persists vehicle in db and adds messages for the simulation worker to register vehicle for missions on mission control
// and to start reporting vehicle state to Mission Control in a periodic manner
func (v VehicleCreationHandler) CreateVehicle(vehicleDetails *vehicle.VehicleDetails) (err error) {

	err = db.StoreVehicleDetails(*vehicleDetails)

	if err != nil {
		return err
	}

	var status = "available_for_missions"

	msg := models.StatusSimulatorMessage{
		Timestamp:       time.Now().Unix(),
		VehicleID:       vehicleDetails.VehicleId,
		MissionStatus:   &status,
		RegisterVehicle: true,
	}

	queues.AddSimulatorMessage(msg)

	return nil

}

