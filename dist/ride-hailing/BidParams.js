"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BidParams_1 = require("../BidParams");
const ProtocolTypes_1 = require("./ProtocolTypes");
/**
 * @class The Class ride-hailing/BidParams represent the parameters of ride-hailing bid.
 */
class BidParams extends BidParams_1.default {
    constructor(values) {
        if (!values) {
            super(BidParams._protocol, BidParams._type);
        }
        else {
            super(BidParams._protocol, BidParams._type, values);
            // TODO: throw if not enough details
            this.currentVehicleLocation = values.currentVehicleLocation;
            this.vehicle = values.vehicle;
            this.driverName = values.driverName;
        }
    }
    static getMessageType() {
        return BidParams._type;
    }
    static getMessageProtocol() {
        return BidParams._protocol;
    }
    serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            currentVehicleLocation: this.currentVehicleLocation,
            vehicle: this.vehicle,
            driverName: this.driverName,
        });
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
        this.currentVehicleLocation = json.currentVehicleLocation;
        this.vehicle = json.vehicle;
        this.driverName = json.driverName;
    }
    equals(other) {
        return this.ttl === other.ttl && super.equals(other);
    }
    getProtocolTypes() {
        return ProtocolTypes_1.default;
    }
}
BidParams._protocol = 'ride_hailing';
BidParams._type = 'bid';
exports.default = BidParams;

//# sourceMappingURL=BidParams.js.map
