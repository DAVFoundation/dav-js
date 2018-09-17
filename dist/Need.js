"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_types_1 = require("./common-types");
const Bid_1 = require("./Bid");
const Kafka_1 = require("./Kafka");
const Message_1 = require("./Message");
/**
 * @class The Need class represent a service request.
 */
class Need {
    constructor(_selfId, _params, _config) {
        this._selfId = _selfId;
        this._params = _params;
        this._config = _config;
        /**/
    }
    get params() {
        return this._params;
    }
    /**
     * @method createBid Used to create a new bid for the current need and publish it to the service consumer.
     * @param bidParams The bid parameters.
     * @returns The created bid.
     */
    async createBid(bidParams) {
        const neederId = this._params.id; // Channel#3
        const bidderId = Kafka_1.default.generateTopicId(); // Channel#6
        bidParams.id = bidderId;
        bidParams.neederDavId = this._params.davId;
        try {
            await Kafka_1.default.createTopic(bidderId, this._config);
        }
        catch (err) {
            // TODO: move this general message to kafka.createTopic
            throw new Error(`Fail to create a topic: ${err}`);
        }
        const bid = new Bid_1.default(bidderId, bidParams, this._config, await Kafka_1.default.messages(bidderId, this._config));
        await Kafka_1.default.sendParams(neederId, bidParams, this._config);
        return bid;
    }
    /**
     * @method bids Used to subscribe for bids for the current need.
     * @returns Observable for bids subscription.
     */
    async bids() {
        const kafkaMessageStream = await Kafka_1.default.messages(this._selfId, this._config); // this._selfId - Channel#3
        const protocolTypesMap = this._params.getProtocolTypes();
        const bidParamsStream = kafkaMessageStream.filterType(protocolTypesMap, protocolTypesMap.bids);
        const bidStream = bidParamsStream.map((bidParams) => {
            return new Bid_1.default(this._selfId, bidParams, this._config, kafkaMessageStream);
        });
        return common_types_1.Observable.fromObservable(bidStream, this._params.id);
    }
    /**
     * @method sendMessage Used to send a message to the service consumer.
     * @param params The message parameters.
     */
    async sendMessage(params) {
        if (this._selfId === this._params.id) {
            throw new Error(`You cannot send message to your own channel`);
        }
        params.senderId = this._selfId; // Channel#2
        return await Kafka_1.default.sendParams(this._params.id, params, this._config); // Channel#3
    }
    /**
     * @method messages Used to subscribe for messages for the current need.
     * @param filterType (optional) array of the expected message params object type.
     * @returns Observable for messages subscription.
     */
    async messages(filterType) {
        const kafkaMessageStream = await Kafka_1.default.messages(this._selfId, this._config);
        const protocolTypesMap = this._params.getProtocolTypes();
        const messageParamsStream = kafkaMessageStream.filterType(protocolTypesMap, filterType || protocolTypesMap.messages);
        const messageStream = messageParamsStream.map((params) => new Message_1.default(this._selfId, params, this._config));
        return common_types_1.Observable.fromObservable(messageStream, messageParamsStream.topic);
    }
}
exports.default = Need;

//# sourceMappingURL=Need.js.map
