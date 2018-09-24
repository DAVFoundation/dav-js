"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NeedFilterParams_1 = require("../NeedFilterParams");
const ProtocolTypes_1 = require("./ProtocolTypes");
/**
 * @class The Class boat-charging/NeedFilterParams represent the parameters that used to filter boat-charging needs.
 */
class NeedFilterParams extends NeedFilterParams_1.default {
    constructor(values) {
        super(NeedFilterParams._protocol, NeedFilterParams._type, values);
        if (!!values) {
            this.maxDimensions = values.maxDimensions;
        }
    }
    static getMessageType() {
        return NeedFilterParams._type;
    }
    static getMessageProtocol() {
        return NeedFilterParams._protocol;
    }
    serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, { dimensions: this.maxDimensions });
        return formattedParams;
    }
    getProtocolTypes() {
        return ProtocolTypes_1.default;
    }
    deserialize(json) {
        super.deserialize(json);
        this.maxDimensions = json.dimensions;
    }
}
NeedFilterParams._protocol = 'boat_charging';
NeedFilterParams._type = 'need_filter';
exports.default = NeedFilterParams;

//# sourceMappingURL=NeedFilterParams.js.map
