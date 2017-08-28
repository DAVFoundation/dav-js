package handlers

import (
	"github.com/DAVFoundation/captain/protocols/vehicle"
	"github.com/DAVFoundation/captain/db"
)

type VehicleCreationHandler struct {

}

func NewVehicleCreationHandler() *VehicleCreationHandler {
	return &VehicleCreationHandler{}
}

func (v VehicleCreationHandler) CreateVehicle(vehicleDetails *vehicle.VehicleDetails) (err error) {

	return db.StoreVehicleDetails(*vehicleDetails)

}

