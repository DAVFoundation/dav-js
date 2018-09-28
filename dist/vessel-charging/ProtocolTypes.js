"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NeedParams_1 = require("./NeedParams");
const BidParams_1 = require("./BidParams");
const MissionParams_1 = require("./MissionParams");
const ChargingArrivalMessageParams_1 = require("./messages/ChargingArrivalMessageParams");
const ChargingCompleteMessageParams_1 = require("./messages/ChargingCompleteMessageParams");
const ChargingStartedMessageParams_1 = require("./messages/ChargingStartedMessageParams");
const DeclineMessageParams_1 = require("./messages/DeclineMessageParams");
const ProviderStatusMessageParams_1 = require("./messages/ProviderStatusMessageParams");
const StartingMessageParams_1 = require("./messages/StartingMessageParams");
const StatusRequestMessageParams_1 = require("./messages/StatusRequestMessageParams");
const VesselStatusMessageParams_1 = require("./messages/VesselStatusMessageParams");
const NeedFilterParams_1 = require("./NeedFilterParams");
exports.default = {
    need_filter: NeedFilterParams_1.default,
    need: NeedParams_1.default,
    bid: BidParams_1.default,
    mission: MissionParams_1.default,
    charging_arrival_message: ChargingArrivalMessageParams_1.default,
    charging_complete_message: ChargingCompleteMessageParams_1.default,
    charging_started_message: ChargingStartedMessageParams_1.default,
    decline_message: DeclineMessageParams_1.default,
    provider_status_message: ProviderStatusMessageParams_1.default,
    starting_message: StartingMessageParams_1.default,
    status_request_message: StatusRequestMessageParams_1.default,
    vessel_status_message: VesselStatusMessageParams_1.default,
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
        'charging_arrival_message',
        'charging_complete_message',
        'charging_started_message',
        'decline_message',
        'provider_status_message',
        'starting_message',
        'status_request_message',
        'vessel_status_message',
    ],
};

//# sourceMappingURL=ProtocolTypes.js.map
