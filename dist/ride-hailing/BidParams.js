"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BidParams_1 = require("../BidParams");
/**
 * @class The Class ride-hailing/BidParams represent the parameters of ride-hailing bid.
 */
class BidParams extends BidParams_1.default {
    constructor(values) {
        if (!values) {
            super(BidParams._protocol, BidParams._messageType);
        }
        else {
            super(BidParams._protocol, BidParams._messageType, values);
            // TODO: throw if not enough details
            this.currentVehicleLocation = values.currentVehicleLocation;
            this.vehicle = values.vehicle;
            this.driverName = values.driverName;
        }
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
}
BidParams._protocol = 'ride_hailing';
BidParams._messageType = 'bid';
exports.default = BidParams;

//# sourceMappingURL=BidParams.js.map
