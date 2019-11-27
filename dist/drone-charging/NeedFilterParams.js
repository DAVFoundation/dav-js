"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NeedFilterParams_1 = require("../NeedFilterParams");
/**
 * @class The Class drone-charging/NeedFilterParams represent the parameters that used to filter drone-charging needs.
 */
class NeedFilterParams extends NeedFilterParams_1.default {
    constructor(values) {
        super(NeedFilterParams._protocol, NeedFilterParams._messageType, values);
        if (!!values) {
            this.maxDimensions = values.maxDimensions;
        }
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
NeedFilterParams._protocol = 'drone_charging';
NeedFilterParams._messageType = 'need_filter';
exports.default = NeedFilterParams;

//# sourceMappingURL=NeedFilterParams.js.map
