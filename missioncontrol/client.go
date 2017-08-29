package missioncontrol

// initiates a thrift protocol for mission control service clients

import (
	"git.apache.org/thrift.git/lib/go/thrift"
	"fmt"
	"github.com/DAVFoundation/captain/config"
)

// stores an initiated protocol for mission control service clients
var protocol thrift.TProtocol

// initiates the protocol
func initProtocol () (_protocol thrift.TProtocol, err error) {

	var transport thrift.TTransport

	addr := fmt.Sprintf("%s:%d", config.MissionControl.Host, config.MissionControl.Port)

	socket, err := thrift.NewTSocket(addr)

	if err != nil {
		fmt.Println("Error opening socket:", err)
		return _protocol, err
	}


	transport = thrift.NewTBufferedTransport(socket, 1024)

	if err := transport.Open(); err != nil {
		return _protocol, err
	}

	_protocol = thrift.NewTBinaryProtocolTransport(transport)

	return _protocol, err

}

// returns the initiated protocol or initiating an saving a protocol for later usages
func getProtocol () (thrift.TProtocol, error) {

	var err error
	if protocol == nil {
		protocol, err = initProtocol()
	}
	return protocol, err

}
