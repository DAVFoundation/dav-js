"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NeedParams_1 = require("../NeedParams");
const ProtocolTypes_1 = require("./ProtocolTypes");
/**
 * @class The Class drone-delivery/NeedParams represent the parameters of drone-delivery need.
 */
class NeedParams extends NeedParams_1.default {
    constructor(values) {
        super(NeedParams._protocol, NeedParams._type, values);
        if (!!values) {
            this.startAt = values.startAt;
            this.startLocation = { lat: values.startLocation.lat, long: values.startLocation.lat };
            this.endLocation = { lat: values.endLocation.lat, long: values.endLocation.lat };
            this.vehicleType = values.vehicleType;
            this.maxAltitude = values.maxAltitude;
        }
    }
    static getMessageType() {
        return NeedParams._type;
    }
    static getMessageProtocol() {
        return NeedParams._protocol;
    }
    serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            startLocation: this.startLocation,
            endLocation: this.endLocation,
            vehicleType: this.vehicleType,
            maxAltitude: this.maxAltitude,
        });
        return formattedParams;
    }
    getProtocolTypes() {
        return ProtocolTypes_1.default;
    }
    deserialize(json) {
        super.deserialize(json);
        this.startLocation = json.startLocation;
        this.endLocation = json.endLocation;
        this.vehicleType = json.vehicleType;
        this.maxAltitude = json.maxAltitude;
    }
}
NeedParams._protocol = 'drone_delivery';
NeedParams._type = 'need';
exports.default = NeedParams;

//# sourceMappingURL=NeedParams.js.map
