package missioncontrol

// provides a thrift client of the StatusReport service client used to send vehicle state mission control

import (
	"github.com/DAVFoundation/captain/protocols/statusreport"
	"git.apache.org/thrift.git/lib/go/thrift"
)

var statusReportClient *statusreport.StatusReportClient

func GetStatusReportClient () (*statusreport.StatusReportClient, error) {

	if statusReportClient == nil {
		protocol, err := getProtocol()

		if err != nil {
			return nil, err
		}

		mp := thrift.NewTMultiplexedProtocol(protocol, "StatusReport")

		statusReportClient = statusreport.NewStatusReportClientProtocol(mp.Transport(), mp, mp)
	}

	return statusReportClient, nil

}