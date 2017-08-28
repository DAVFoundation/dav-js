package models

import "github.com/DAVFoundation/captain/protocols/davuser"

type SimulatorMessage struct {

	Timestamp int64

	Type string

	VehicleID *davuser.DAVUser

}