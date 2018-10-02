"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageParams_1 = require("../MessageParams");
const MessageParams_2 = require("./MessageParams");
/**
 * @class The Class ride-hailing/MessageParams represent the parameters of ride-hailing message for OnTheWay message only.
 */
class MessageParams extends MessageParams_1.default {
    constructor(values) {
        super(MessageParams._protocol, MessageParams._messageType, values);
        if (!!values) {
            this.vehicleLocation = values.vehicleLocation;
            this.missionStatus = MessageParams_2.MissionStatus.OnTheWay;
        }
    }
    serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            missionStatus: this.missionStatus,
            vehicleLocation: this.vehicleLocation,
        });
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
        this.missionStatus = json.missionStatus;
        this.vehicleLocation = json.vehicleLocation;
    }
}
MessageParams._protocol = 'ride_hailing';
MessageParams._messageType = 'vehicle_location_message';
exports.default = MessageParams;

//# sourceMappingURL=VehicleLocationMessageParams.js.map
