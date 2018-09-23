"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NeedParams_1 = require("../NeedParams");
const ProtocolTypes_1 = require("./ProtocolTypes");
/**
 * @class The Class drone-charging/NeedParams represent the parameters of drone-charging need.
 */
class NeedParams extends NeedParams_1.default {
    constructor(values) {
        super(NeedParams._protocol, NeedParams._type, values);
    }
    static getMessageType() {
        return NeedParams._type;
    }
    static getMessageProtocol() {
        return NeedParams._protocol;
    }
    serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }
    getProtocolTypes() {
        return ProtocolTypes_1.default;
    }
    deserialize(json) {
        super.deserialize(json);
    }
}
NeedParams._protocol = 'drone_charging';
NeedParams._type = 'need';
exports.default = NeedParams;

//# sourceMappingURL=NeedParams.js.map
