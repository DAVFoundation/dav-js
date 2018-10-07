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
exports.ChargingArrivalMessageParams = ChargingArrivalMessageParams_1.default;
const ChargingCompleteMessageParams_1 = require("./messages/ChargingCompleteMessageParams");
exports.ChargingCompleteMessageParams = ChargingCompleteMessageParams_1.default;
const ChargingStartedMessageParams_1 = require("./messages/ChargingStartedMessageParams");
exports.ChargingStartedMessageParams = ChargingStartedMessageParams_1.default;
const DeclineMessageParams_1 = require("./messages/DeclineMessageParams");
exports.DeclineMessageParams = DeclineMessageParams_1.default;
const ProviderStatusMessageParams_1 = require("./messages/ProviderStatusMessageParams");
exports.ProviderStatusMessageParams = ProviderStatusMessageParams_1.default;
const StartingMessageParams_1 = require("./messages/StartingMessageParams");
exports.StartingMessageParams = StartingMessageParams_1.default;
const StatusRequestMessageParams_1 = require("./messages/StatusRequestMessageParams");
exports.StatusRequestMessageParams = StatusRequestMessageParams_1.default;
const StatusMessageParams_1 = require("./messages/StatusMessageParams");
exports.StatusMessageParams = StatusMessageParams_1.default;
KafkaMessageFactory_2.default.instance.registerMessageClasses([
    {
        protocol: NeedFilterParams_1.default._protocol,
        messageType: NeedFilterParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.NeedFilter,
        classType: NeedFilterParams_1.default,
    },
    {
        protocol: NeedParams_1.default._protocol,
        messageType: NeedParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Need,
        classType: NeedParams_1.default,
    },
    {
        protocol: BidParams_1.default._protocol,
        messageType: BidParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Bid,
        classType: BidParams_1.default,
    },
    {
        protocol: MissionParams_1.default._protocol,
        messageType: MissionParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Mission,
        classType: MissionParams_1.default,
    },
    {
        protocol: ChargingArrivalMessageParams_1.default._protocol,
        messageType: ChargingArrivalMessageParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Message,
        classType: ChargingArrivalMessageParams_1.default,
    },
    {
        protocol: ChargingCompleteMessageParams_1.default._protocol,
        messageType: ChargingCompleteMessageParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Message,
        classType: ChargingCompleteMessageParams_1.default,
    },
    {
        protocol: ChargingStartedMessageParams_1.default._protocol,
        messageType: ChargingStartedMessageParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Message,
        classType: ChargingStartedMessageParams_1.default,
    },
    {
        protocol: DeclineMessageParams_1.default._protocol,
        messageType: DeclineMessageParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Message,
        classType: DeclineMessageParams_1.default,
    },
    {
        protocol: ProviderStatusMessageParams_1.default._protocol,
        messageType: ProviderStatusMessageParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Message,
        classType: ProviderStatusMessageParams_1.default,
    },
    {
        protocol: StartingMessageParams_1.default._protocol,
        messageType: StartingMessageParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Message,
        classType: StartingMessageParams_1.default,
    },
    {
        protocol: StatusRequestMessageParams_1.default._protocol,
        messageType: StatusRequestMessageParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Message,
        classType: StatusRequestMessageParams_1.default,
    },
    {
        protocol: StatusMessageParams_1.default._protocol,
        messageType: StatusMessageParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Message,
        classType: StatusMessageParams_1.default,
    },
]);

//# sourceMappingURL=index.js.map
