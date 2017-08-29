package queues

// helper functions for managing status simulation queue

import (
	"github.com/DAVFoundation/captain/db"
	"github.com/DAVFoundation/captain/db/models"
	"encoding/json"
	"github.com/DAVFoundation/captain/util"
)

const QUEUE_STATUS_SIMULATOR_KEY = "queues:status_simulator"

var logger = util.GetCurrentPackageLogger()

// adds a message to simulation queue
func AddSimulatorMessage(msg models.StatusSimulatorMessage) error {

	logger.Debug("adding message to simulation queue: ", msg, " MissionStatus: ", *msg.MissionStatus)

	bytes, err := json.Marshal(msg)

	if err != nil {
		return err
	}

	return db.ZAdd(QUEUE_STATUS_SIMULATOR_KEY, msg.Timestamp, string(bytes))

}

// pops one simulation messages from queue
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