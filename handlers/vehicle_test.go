package handlers

import (
	"testing"
	"github.com/DAVFoundation/captain/protocols/vehicle"
	"github.com/DAVFoundation/captain/protocols/davuser"
	"github.com/DAVFoundation/captain/db"
)

var (
	vehicleUID = "tester"
	model      = "captain-1"
)

func TestVehicleCreationHandler_CreateVehicle(t *testing.T) {

	db.Init()

	handler := VehicleCreationHandler{}

	vehicleDetails := vehicle.NewVehicleDetails()
	vehicleDetails.VehicleId = davuser.NewDAVUser()
	vehicleDetails.VehicleId.UID = vehicleUID
	vehicleDetails.Model = &model

	err := handler.CreateVehicle(vehicleDetails)

	if err != nil {
		t.Error(err)
		t.FailNow()
	}

	vehicleDetailsFromDB, err := db.GetVehicleDetails(vehicleUID)

	if err != nil {
		t.Error(err)
		t.FailNow()
	}

	if *vehicleDetailsFromDB.Model != model {
		t.Errorf("expected vehicle user uid from db to equal %s. got %s", model, *vehicleDetailsFromDB.Model)
		t.FailNow()
	}

}
