"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_types_1 = require("./common-types");
const Need_1 = require("./Need");
const Bid_1 = require("./Bid");
const Mission_1 = require("./Mission");
const Kafka_1 = require("./Kafka");
const axios_1 = require("axios");
const KafkaMessageFactory_1 = require("./KafkaMessageFactory");
/**
 * @class The Identity class represent registered DAV identity instance.
 */
class Identity {
    constructor(id, davId, _config) {
        this.id = id;
        this.davId = davId;
        this._config = _config;
        this.topics = {};
        /**/
    }
    async registerNewTopic() {
        const topic = Kafka_1.default.generateTopicId();
        try {
            await Kafka_1.default.createTopic(topic, this._config);
        }
        catch (err) {
            // TODO: move this general message to kafka class
            throw new Error(`Fail to create a topic: ${err}`);
        }
        return topic;
    }
    /**
     * @method publishNeed Used to create a new need and publish it to the relevant service providers.
     * @param needParams the need parameters.
     * @returns the created need.
     */
    async publishNeed(needParams) {
        const bidsChannelName = await this.registerNewTopic(); // Channel#3
        needParams.id = bidsChannelName;
        needParams.davId = this.davId || needParams.davId;
        try {
            await axios_1.default.post(`${this._config.apiSeedUrls[0]}/publishNeed/${bidsChannelName}`, needParams.serialize());
        }
        catch (err) {
            throw new Error(`Fail to publish need: ${err}`);
        }
        return new Need_1.default(bidsChannelName, needParams, this._config);
    }
    /**
     * @method needsForType Used to subscribe for specific needs (filtered by params).
     * @param needFilterParams the filter parameters.
     * @returns Observable for needs subscription.
     */
    async needsForType(needFilterParams) {
        const formattedParams = needFilterParams.serialize();
        let needTypeTopic = '';
        if (this.topics[formattedParams.protocol]) {
            needTypeTopic = this.topics[formattedParams.protocol];
        }
        else {
            needTypeTopic = await this.registerNewTopic();
            this.topics[formattedParams.protocol] = needTypeTopic;
            try {
                await axios_1.default.post(`${this._config.apiSeedUrls[0]}/needsForType/${needTypeTopic}`, formattedParams);
            }
            catch (err) {
                throw new Error(`Needs registration failed: ${err}`);
            }
        }
        const kafkaMessageStream = await Kafka_1.default.messages(needTypeTopic, this._config); // Channel#2
        const needParamsStream = kafkaMessageStream.filterType(KafkaMessageFactory_1.default.instance.getMessageTypes(needFilterParams.protocol, KafkaMessageFactory_1.MessageCategories.Need));
        const observable = common_types_1.Observable.fromObservable(needParamsStream.map((needParams) => new Need_1.default(needTypeTopic, needParams, this._config)), needParamsStream.topic);
        return observable;
    }
    /**
     * @method missions Used to subscribe for missions.
     * @returns Observable for missions subscription.
     */
    async missions() {
        throw new Error('Not implemented in this version');
    }
    /**
     * @method messages Used to subscribe for messages.
     * @returns Observable for messages subscription.
     */
    async messages() {
        throw new Error('Not implemented in this version');
    }
    /**
     * @method need Used to restore an existed need.
     * @param needSelfId The selfId that used to create the bid.
     * @param params The need parameters.
     * @returns The restored need.
     */
    need(needSelfId, params) {
        return new Need_1.default(needSelfId, params, this._config);
    }
    /**
     * @method bid Used to restore an existed bid.
     * @param bidSelfId The selfId that used to create the bid.
     * @param params The bid parameters.
     * @returns The restored bid.
     */
    bid(bidSelfId, params) {
        return new Bid_1.default(bidSelfId, params, this._config);
    }
    /**
     * @method mission Used to restore an existed mission.
     * @param missionSelfId The mission self topic ID.
     * @param missionPeerId The mission peer topic ID.
     * @param params The mission parameters.
     * @returns The restored mission.
     */
    mission(missionSelfId, missionPeerId, params) {
        return new Mission_1.default(missionSelfId, missionPeerId, params, this._config);
    }
}
exports.default = Identity;

//# sourceMappingURL=Identity.js.map
