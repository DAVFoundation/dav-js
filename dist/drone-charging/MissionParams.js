"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MissionParams_1 = require("../MissionParams");
/**
 * @class The Class drone-charging/MissionParams represent the parameters of drone-charging mission.
 */
class MissionParams extends MissionParams_1.default {
    constructor(values) {
        super(MissionParams._protocol, MissionParams._type, values);
    }
    static getMessageType() {
        return MissionParams._type;
    }
    static getMessageProtocol() {
        return MissionParams._protocol;
    }
    serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }
    deserialize(json) {
        super.deserialize(json);
    }
}
MissionParams._protocol = 'drone_charging';
MissionParams._type = 'mission';
exports.default = MissionParams;

//# sourceMappingURL=MissionParams.js.map
