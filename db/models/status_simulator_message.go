package models

// stores the simulation message pushed into the queue by the captain server and processed by the wimulation worker

import "github.com/DAVFoundation/captain/protocols/davuser"

type StatusSimulatorMessage struct {

	// timestamp of when the worker should process this message
	Timestamp int64

	// the vehicle identifier
	VehicleID *davuser.DAVUser

	// mission status that should be reported to mission control
	MissionStatus *string

	// whether to register the vehicle for missions on mission control
	RegisterVehicle bool

}