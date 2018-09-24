"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BidParams_1 = require("../BidParams");
const ProtocolTypes_1 = require("./ProtocolTypes");
/**
 * @class The Class drone-charging/BidParams represent the parameters of drone-charging bid.
 */
class BidParams extends BidParams_1.default {
    constructor(values) {
        super(BidParams._protocol, BidParams._type, values);
        if (!!values) {
            this.plugType = values.plugType;
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
            plugType: this.plugType,
        });
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
        this.plugType = json.plugType;
    }
    equals(other) {
        return super.equals(other) && this.plugType === other.plugType;
    }
    getProtocolTypes() {
        return ProtocolTypes_1.default;
    }
}
BidParams._protocol = 'drone_charging';
BidParams._type = 'bid';
exports.default = BidParams;

//# sourceMappingURL=BidParams.js.map
