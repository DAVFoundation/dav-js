package queues

import (
	"testing"
	"github.com/DAVFoundation/captain/db/models"
	"time"
	"github.com/DAVFoundation/captain/db"
)

func TestAddMessagePollMessage(t *testing.T) {

	db.Init()

	msg := models.StatusSimulatorMessage{
		Timestamp: time.Now().Unix(),
		Type: "test",
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

	if polledMsg.Type != "test" {
		t.Errorf("expected polled message type to equal %s. got %s", "test", polledMsg.Type)
		t.FailNow()

	}

}

func TestPollMessage(t *testing.T) {



}


