"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BidParams_1 = require("./BidParams");
const MissionParams_1 = require("./MissionParams");
const MessageParams_1 = require("./MessageParams");
const NeedFilterParams_1 = require("./NeedFilterParams");
const NeedParams_1 = require("./NeedParams");
exports.default = {
    need_filter: NeedFilterParams_1.default,
    need: NeedParams_1.default,
    bid: BidParams_1.default,
    mission: MissionParams_1.default,
    message: MessageParams_1.default,
    needFilters: [
        'need_filter',
    ],
    needs: [
        'need',
    ],
    bids: [
        'bid',
    ],
    missions: [
        'mission',
    ],
    messages: [
        'message',
    ],
};

//# sourceMappingURL=ProtocolTypes.js.map
