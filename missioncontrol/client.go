package missioncontrol

import (
	"git.apache.org/thrift.git/lib/go/thrift"
	"fmt"
	"github.com/DAVFoundation/captain/config"
)

var protocol thrift.TProtocol

func initProtocol () error {

	var transport thrift.TTransport
	var err error

	addr := fmt.Sprintf("%s:%d", config.MissionControl.Host, config.MissionControl.Port)

	socket, err := thrift.NewTSocket(addr)

	if err != nil {
		fmt.Println("Error opening socket:", err)
		return err
	}


	transport = thrift.NewTBufferedTransport(socket, 1024)

	if err := transport.Open(); err != nil {
		return err
	}

	protocol = thrift.NewTBinaryProtocolTransport(transport)

	return nil

}

func getProtocol () (thrift.TProtocol, error) {

	var err error
	if protocol == nil {
		err = initProtocol()
	}
	return protocol, err

}
