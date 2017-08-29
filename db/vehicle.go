package db

// persisted vehicle details repository manager

import (
	"github.com/DAVFoundation/captain/protocols/vehicle"
	"encoding/json"
)

const KEY_PREFIX_VEHICLE_DETAILS = "vehicle_details:"

// persists vehicle details item in db by its vehicle uid
func StoreVehicleDetails (vehicleDetails vehicle.VehicleDetails) error {

	serialized, err := json.Marshal(vehicleDetails)

	if err != nil {
		return err
	}

	return Set(KEY_PREFIX_VEHICLE_DETAILS + vehicleDetails.VehicleId.GetUID(), serialized)

}

// fetches vehicle details item from db by its vehicle uid
func GetVehicleDetails (vehicleUID string) (*vehicle.VehicleDetails, error) {

	var vehicleDetails vehicle.VehicleDetails

	obj, err := Get(vehicleUID)

	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(obj, &vehicleDetails)

	if err != nil {
		return nil, err
	}

	return &vehicleDetails, nil

}