package models

import "github.com/DAVFoundation/captain/protocols/davuser"

type StatusSimulatorMessage struct {

	Timestamp int64

	Type string

	VehicleID *davuser.DAVUser

	MissionStatus *string

	RegisterVehicle bool

}