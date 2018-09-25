"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MissionParams_1 = require("../MissionParams");
/**
 * @class The Class ride-hailing/MissionParams represent the parameters of ride-hailing mission.
 */
class MissionParams extends MissionParams_1.default {
    constructor(values) {
        super(MissionParams._protocol, MissionParams._messageType, values);
    }
    serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
    }
}
MissionParams._protocol = 'ride_hailing';
MissionParams._messageType = 'mission';
exports.default = MissionParams;

//# sourceMappingURL=MissionParams.js.map
