"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NeedFilterParams_1 = require("../NeedFilterParams");
/**
 * @class The Class drone-delivery/NeedFilterParams represent the parameters that used to filter drone-delivery needs.
 */
class NeedFilterParams extends NeedFilterParams_1.default {
    constructor(values) {
        super(NeedFilterParams._protocol, NeedFilterParams._type, values);
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
    deserialize(json) {
        super.deserialize(json);
        this.maxDimensions = json.dimensions;
    }
}
NeedFilterParams._protocol = 'drone_delivery';
NeedFilterParams._type = 'need_filter';
exports.default = NeedFilterParams;

//# sourceMappingURL=NeedFilterParams.js.map
