"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NeedFilterParams_1 = require("../NeedFilterParams");
const ProtocolTypes_1 = require("./ProtocolTypes");
/**
 * @class The Class ride-hailing/NeedFilterParams represent the parameters that used to filter ride-hailing needs.
 */
class NeedFilterParams extends NeedFilterParams_1.default {
    constructor(values) {
        super(NeedFilterParams._protocol, NeedFilterParams._type, values);
        if (!!values) {
            if (!values.location || !values.location.lat || !values.location.long || !values.radius) {
                throw new Error('NeedFilter lack of essential parameters');
            }
        }
    }
    static getMessageType() {
        return NeedFilterParams._type;
    }
    static getMessageProtocol() {
        return NeedFilterParams._protocol;
    }
    getProtocolTypes() {
        return ProtocolTypes_1.default;
    }
    serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
    }
}
NeedFilterParams._protocol = 'ride_hailing';
NeedFilterParams._type = 'need_filter';
exports.default = NeedFilterParams;

//# sourceMappingURL=NeedFilterParams.js.map
