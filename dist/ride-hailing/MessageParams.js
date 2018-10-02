"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageParams_1 = require("../MessageParams");
var MissionStatus;
(function (MissionStatus) {
    MissionStatus["OnTheWay"] = "on_the_way";
    MissionStatus["VehicleAtPickupLocation"] = "vehicle_at_pickup_location";
    MissionStatus["PassengerIsComing"] = "passenger_is_coming";
    MissionStatus["RidingHasStarted"] = "riding_has_started";
    MissionStatus["RidingHasFinished"] = "riding_has_finished";
})(MissionStatus = exports.MissionStatus || (exports.MissionStatus = {}));
/**
 * @class The Class ride-hailing/MessageParams represent the parameters of ride-hailing message for all messages except OnTheWay message.
 */
class MessageParams extends MessageParams_1.default {
    constructor(values) {
        super(MessageParams._protocol, MessageParams._messageType, values);
        if (!!values) {
            this.missionStatus = values.missionStatus;
        }
    }
    serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            missionStatus: this.missionStatus,
        });
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
        this.missionStatus = json.missionStatus;
    }
}
MessageParams._protocol = 'ride_hailing';
MessageParams._messageType = 'message';
exports.default = MessageParams;

//# sourceMappingURL=MessageParams.js.map
