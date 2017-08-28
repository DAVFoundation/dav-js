package queues

import (
	"github.com/DAVFoundation/captain/db"
	"github.com/DAVFoundation/captain/db/models"
	"encoding/json"
)

const QUEUE_SIMULATOR_KEY = "queues:simulator"

func AddSimulatorMessage(msg models.SimulatorMessage) error {

	bytes, err := json.Marshal(msg)

	if err != nil {
		return err
	}

	return db.ZAdd(QUEUE_SIMULATOR_KEY, msg.Timestamp, string(bytes))

}

func PollSimulatorMessage() (*models.SimulatorMessage, error) {

	item, err := db.ZPop(QUEUE_SIMULATOR_KEY)

	if err != nil {
		return nil, err
	}

	var msg models.SimulatorMessage

	err = json.Unmarshal([]byte(item), &msg)

	if err != nil {
		return nil, err
	}

	return &msg, nil

}