"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageParams_1 = require("../MessageParams");
const common_enums_1 = require("../common-enums");
const ProtocolTypes_1 = require("./ProtocolTypes");
/**
 * @class The Class ride-hailing/MessageParams represent the parameters of ride-hailing message for OnTheWay message only.
 */
class MessageParams extends MessageParams_1.default {
    constructor(values) {
        super(MessageParams._protocol, MessageParams._type, values);
        if (!!values) {
            this.vehicleLocation = values.vehicleLocation;
            this.missionStatus = common_enums_1.RideHailingMissionStatus.OnTheWay;
        }
    }
    static getMessageType() {
        return MessageParams._type;
    }
    static getMessageProtocol() {
        return MessageParams._protocol;
    }
    serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            missionStatus: this.missionStatus,
            vehicleLocation: this.vehicleLocation,
        });
        return formattedParams;
    }
    getProtocolTypes() {
        return ProtocolTypes_1.default;
    }
    deserialize(json) {
        super.deserialize(json);
        this.missionStatus = json.missionStatus;
        this.vehicleLocation = json.vehicleLocation;
    }
}
MessageParams._protocol = 'ride_hailing';
MessageParams._type = 'vehicle_location_message';
exports.default = MessageParams;

//# sourceMappingURL=VehicleLocationMessageParams.js.map
