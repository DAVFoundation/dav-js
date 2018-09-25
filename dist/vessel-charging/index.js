"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KafkaMessageFactory_1 = require("./../KafkaMessageFactory");
const enums = require("./enums");
exports.enums = enums;
const NeedParams_1 = require("./NeedParams");
exports.NeedParams = NeedParams_1.default;
const NeedFilterParams_1 = require("./NeedFilterParams");
exports.NeedFilterParams = NeedFilterParams_1.default;
const KafkaMessageFactory_2 = require("../KafkaMessageFactory");
const BidParams_1 = require("./BidParams");
exports.BidParams = BidParams_1.default;
const MissionParams_1 = require("./MissionParams");
exports.MissionParams = MissionParams_1.default;
const ChargingArrivalMessageParams_1 = require("./messages/ChargingArrivalMessageParams");
const ChargingCompleteMessageParams_1 = require("./messages/ChargingCompleteMessageParams");
const ChargingStartedMessageParams_1 = require("./messages/ChargingStartedMessageParams");
const DeclineMessageParams_1 = require("./messages/DeclineMessageParams");
const ProviderStatusMessageParams_1 = require("./messages/ProviderStatusMessageParams");
const StartingMessageParams_1 = require("./messages/StartingMessageParams");
const StatusRequestMessageParams_1 = require("./messages/StatusRequestMessageParams");
const VesselStatusMessageParams_1 = require("./messages/VesselStatusMessageParams");
KafkaMessageFactory_2.default.instance.registerMessageClasses([
    {
        protocol: NeedFilterParams_1.default._protocol, messageType: NeedFilterParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.NeedFilter, classType: NeedFilterParams_1.default,
    },
    {
        protocol: NeedParams_1.default._protocol, messageType: NeedParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Need, classType: NeedParams_1.default,
    },
    {
        protocol: BidParams_1.default._protocol, messageType: BidParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Bid, classType: BidParams_1.default,
    },
    {
        protocol: MissionParams_1.default._protocol, messageType: MissionParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Mission, classType: MissionParams_1.default,
    },
    {
        protocol: ChargingArrivalMessageParams_1.default._protocol, messageType: ChargingArrivalMessageParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Message, classType: ChargingArrivalMessageParams_1.default,
    },
    {
        protocol: ChargingCompleteMessageParams_1.default._protocol, messageType: ChargingCompleteMessageParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Message, classType: ChargingCompleteMessageParams_1.default,
    },
    {
        protocol: ChargingStartedMessageParams_1.default._protocol, messageType: ChargingStartedMessageParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Message, classType: ChargingStartedMessageParams_1.default,
    },
    {
        protocol: DeclineMessageParams_1.default._protocol, messageType: DeclineMessageParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Message, classType: DeclineMessageParams_1.default,
    },
    {
        protocol: ProviderStatusMessageParams_1.default._protocol, messageType: ProviderStatusMessageParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Message, classType: ProviderStatusMessageParams_1.default,
    },
    {
        protocol: StartingMessageParams_1.default._protocol, messageType: StartingMessageParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Message, classType: StartingMessageParams_1.default,
    },
    {
        protocol: StatusRequestMessageParams_1.default._protocol, messageType: StatusRequestMessageParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Message, classType: StatusRequestMessageParams_1.default,
    },
    {
        protocol: VesselStatusMessageParams_1.default._protocol, messageType: VesselStatusMessageParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Message, classType: VesselStatusMessageParams_1.default,
    },
]);

//# sourceMappingURL=index.js.map
