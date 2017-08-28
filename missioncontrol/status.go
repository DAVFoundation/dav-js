package missioncontrol

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