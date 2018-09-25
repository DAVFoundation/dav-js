"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BidParams_1 = require("../BidParams");
/**
 * @class The Class drone-delivery/BidParams represent the parameters of drone-delivery bid.
 */
class BidParams extends BidParams_1.default {
    constructor(values) {
        super(BidParams._protocol, BidParams._type, values);
        if (!!values) {
            this.eta = values.eta;
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
            eta: this.eta,
        });
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
        this.eta = json.eta;
    }
    equals(other) {
        return super.equals(other) && this.eta === other.eta;
    }
}
BidParams._protocol = 'drone_delivery';
BidParams._type = 'bid';
exports.default = BidParams;

//# sourceMappingURL=BidParams.js.map
