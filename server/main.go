package main

import (
	"git.apache.org/thrift.git/lib/go/thrift"
	"crypto/tls"
	"github.com/DAVFoundation/captain/protocols/vehiclecreation"
	"fmt"
	"github.com/DAVFoundation/captain/config"
	"github.com/DAVFoundation/captain/handlers"
	"github.com/DAVFoundation/captain/db"
)

func main () {

	initConfig()

	db.Init()

	addr := fmt.Sprintf("%s:%d", config.Server.Host, config.Server.Port)

	runServer(thrift.NewTBufferedTransportFactory(1024), thrift.NewTBinaryProtocolFactoryDefault(), addr, false)

}

func runServer(transportFactory thrift.TTransportFactory, protocolFactory thrift.TProtocolFactory, addr string, secure bool) error {
	var transport thrift.TServerTransport
	var err error
	if secure {
		cfg := new(tls.Config)
		if cert, err := tls.LoadX509KeyPair(config.Server.CertPath, config.Server.KeyPath); err == nil {
			cfg.Certificates = append(cfg.Certificates, cert)
		} else {
			return err
		}
		transport, err = thrift.NewTSSLServerSocket(addr, cfg)
	} else {
		transport, err = thrift.NewTServerSocket(addr)
	}

	if err != nil {
		return err
	}

	mp := thrift.NewTMultiplexedProcessor()

	handler := handlers.NewVehicleCreationHandler()
	processor := vehiclecreation.NewVehicleCreationProcessor(handler)

	mp.RegisterProcessor("VehicleCreation", processor)

	server := thrift.NewTSimpleServer4(mp, transport, transportFactory, protocolFactory)

	fmt.Println("thrift server is listening on: " + addr)

	return server.Serve()
}
