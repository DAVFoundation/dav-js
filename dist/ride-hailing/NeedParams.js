"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NeedParams_1 = require("../NeedParams");
const ProtocolTypes_1 = require("./ProtocolTypes");
/**
 * @class The Class ride-hailing/NeedParams represent the parameters of ride-hailing need.
 */
class NeedParams extends NeedParams_1.default {
    constructor(values) {
        super(NeedParams._protocol, NeedParams._type, values);
        if (!!values) {
            if (!values.pickupLocation || !values.destinationLocation) {
                throw new Error('Need lack of essential details');
            }
            this.pickupLocation = values.pickupLocation;
            this.destinationLocation = values.destinationLocation;
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
            pickupLocation: this.pickupLocation,
            destinationLocation: this.destinationLocation,
        });
        return formattedParams;
    }
    getProtocolTypes() {
        return ProtocolTypes_1.default;
    }
    deserialize(json) {
        super.deserialize(json);
        this.pickupLocation = json.pickupLocation;
        this.destinationLocation = json.destinationLocation;
    }
}
NeedParams._protocol = 'ride_hailing';
NeedParams._type = 'need';
exports.default = NeedParams;

//# sourceMappingURL=NeedParams.js.map
