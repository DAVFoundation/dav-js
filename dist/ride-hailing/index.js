"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KafkaMessageFactory_1 = require("./../KafkaMessageFactory");
const NeedParams_1 = require("./NeedParams");
exports.NeedParams = NeedParams_1.default;
const NeedFilterParams_1 = require("./NeedFilterParams");
exports.NeedFilterParams = NeedFilterParams_1.default;
const KafkaMessageFactory_2 = require("../KafkaMessageFactory");
const BidParams_1 = require("./BidParams");
exports.BidParams = BidParams_1.default;
const MissionParams_1 = require("./MissionParams");
exports.MissionParams = MissionParams_1.default;
const MessageParams_1 = require("./MessageParams");
exports.MessageParams = MessageParams_1.default;
exports.MissionStatus = MessageParams_1.MissionStatus;
const VehicleLocationMessageParams_1 = require("./VehicleLocationMessageParams");
exports.VehicleLocationMessageParams = VehicleLocationMessageParams_1.default;
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
        protocol: MessageParams_1.default._protocol, messageType: MessageParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Message, classType: MessageParams_1.default,
    },
    {
        protocol: VehicleLocationMessageParams_1.default._protocol, messageType: VehicleLocationMessageParams_1.default._messageType,
        messageCategory: KafkaMessageFactory_1.MessageCategories.Message, classType: VehicleLocationMessageParams_1.default,
    },
]);

//# sourceMappingURL=index.js.map
