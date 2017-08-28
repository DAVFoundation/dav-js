package queues

import (
	"github.com/DAVFoundation/captain/db"
	"github.com/DAVFoundation/captain/db/models"
	"encoding/json"
)

const QUEUE_STATUS_SIMULATOR_KEY = "queues:status_simulator"

func AddSimulatorMessage(msg models.StatusSimulatorMessage) error {

	bytes, err := json.Marshal(msg)

	if err != nil {
		return err
	}

	return db.ZAdd(QUEUE_STATUS_SIMULATOR_KEY, msg.Timestamp, string(bytes))

}

func PollSimulatorMessage() (*models.StatusSimulatorMessage, error) {

	item, err := db.ZPop(QUEUE_STATUS_SIMULATOR_KEY)

	if err != nil {
		return nil, err
	}

	var msg models.StatusSimulatorMessage

	err = json.Unmarshal([]byte(item), &msg)

	if err != nil {
		return nil, err
	}

	return &msg, nil

}