"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NeedParams_1 = require("../NeedParams");
/**
 * @class The Class drone-charging/NeedParams represent the parameters of drone-charging need.
 */
class NeedParams extends NeedParams_1.default {
    constructor(values) {
        super(NeedParams._protocol, NeedParams._messageType, values);
        if (!!values) {
            if (!values.location) {
                throw new Error('location is a required field');
            }
            this.startAt = values.startAt;
            this.dimensions = values.dimensions;
            this.batteryCapacity = values.batteryCapacity;
            this.currentBatteryCharge = values.currentBatteryCharge;
            this.energySource = values.energySource;
            this.amenities = values.amenities;
        }
    }
    serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            startAt: this.startAt,
            dimensions: this.dimensions,
            batteryCapacity: this.batteryCapacity,
            currentBatteryCharge: this.currentBatteryCharge,
            energySource: this.energySource,
            amenities: this.amenities,
        });
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
        this.startAt = json.startAt;
        this.dimensions = json.dimensions;
        this.batteryCapacity = json.batteryCapacity;
        this.currentBatteryCharge = json.currentBatteryCharge;
        this.energySource = json.energySource;
        this.amenities = json.amenities;
    }
}
NeedParams._protocol = 'drone_charging';
NeedParams._messageType = 'need';
exports.default = NeedParams;

//# sourceMappingURL=NeedParams.js.map
