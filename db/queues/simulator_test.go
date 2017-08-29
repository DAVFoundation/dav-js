package queues

import (
	"testing"
	"github.com/DAVFoundation/captain/db/models"
	"time"
	"github.com/DAVFoundation/captain/db"
	"github.com/DAVFoundation/captain/protocols/davuser"
)

func TestAddMessagePollMessage(t *testing.T) {

	db.Init()

	msg := models.StatusSimulatorMessage{
		Timestamp: time.Now().Unix(),
		VehicleID: &davuser.DAVUser{
			UID: "test",
		},
	}

	err := db.Del(QUEUE_STATUS_SIMULATOR_KEY)

	if err != nil {
		t.Error(err)
		t.FailNow()
	}

	err = AddSimulatorMessage(msg)

	if err != nil {
		t.Error(err)
		t.FailNow()
	}

	polledMsg, err := PollSimulatorMessage()

	if err != nil {
		t.Error(err)
		t.FailNow()
	}

	if polledMsg.VehicleID.GetUID() != "test" {
		t.Errorf("expected polled message vehicle uid to equal %s. got %s", "test", polledMsg.VehicleID.GetUID())
		t.FailNow()

	}

}

func TestPollMessage(t *testing.T) {



}


