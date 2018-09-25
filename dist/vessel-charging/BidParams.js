"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BidParams_1 = require("../BidParams");
/**
 * @class The Class boat-charging/BidParams represent the parameters of boat-charging bid.
 */
class BidParams extends BidParams_1.default {
    constructor(values) {
        super(BidParams._protocol, BidParams._messageType, values);
        if (!!values) {
            if (!values.availableFrom) {
                throw new Error('availableFrom is a required field');
            }
            this.entranceLocation = values.entranceLocation;
            this.exitLocation = values.exitLocation;
            this.availableFrom = values.availableFrom;
            this.availableUntil = values.availableUntil;
            this.energySource = values.energySource;
            this.amenities = values.amenities;
            this.provider = values.provider;
            this.manufacturer = values.manufacturer;
            this.model = values.model;
        }
    }
    static getMessageType() {
        return BidParams._messageType;
    }
    static getMessageProtocol() {
        return BidParams._protocol;
    }
    serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            entranceLocation: this.entranceLocation,
            exitLocation: this.exitLocation,
            availableFrom: this.availableFrom,
            availableUntil: this.availableUntil,
            energySource: this.energySource,
            amenities: this.amenities,
            provider: this.amenities,
            manufacturer: this.amenities,
            model: this.amenities,
        });
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
        this.entranceLocation = json.entranceLocation;
        this.exitLocation = json.exitLocation;
        this.availableFrom = json.availableFrom;
        this.availableUntil = json.availableUntil;
        this.energySource = json.energySource;
        this.amenities = json.amenities;
        this.provider = json.provider;
        this.manufacturer = json.manufacturer;
        this.model = json.model;
    }
    equals(other) {
        return super.equals(other);
    }
}
BidParams._protocol = 'boat_charging';
BidParams._messageType = 'bid';
exports.default = BidParams;

//# sourceMappingURL=BidParams.js.map
