package missioncontrol

// provides a thrift client of the Registration service client used to register vehicles in mission control

import (
	"git.apache.org/thrift.git/lib/go/thrift"
	"github.com/DAVFoundation/captain/protocols/registration"
)

var registrationClient *registration.RegistrationClient

func GetRegistrationClient () (*registration.RegistrationClient, error) {

	if registrationClient == nil {
		protocol, err := getProtocol()

		if err != nil {
			return nil, err
		}

		mp := thrift.NewTMultiplexedProtocol(protocol, "Registration")

		registrationClient = registration.NewRegistrationClientProtocol(mp.Transport(), mp, mp)
	}

	return registrationClient, nil

}