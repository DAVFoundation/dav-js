"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_types_1 = require("./common-types");
const MissionPeerIdMessageParams_1 = require("./MissionPeerIdMessageParams");
const Message_1 = require("./Message");
const Mission_1 = require("./Mission");
const Kafka_1 = require("./Kafka");
const Contracts_1 = require("./Contracts");
const CommitmentConfirmationParams_1 = require("./CommitmentConfirmationParams");
const CommitmentRequest_1 = require("./CommitmentRequest");
const CommitmentConfirmation_1 = require("./CommitmentConfirmation");
const CommitmentRequestParams_1 = require("./CommitmentRequestParams");
/**
 * @class Bid class represent a bid for service request.
 */
class Bid {
    constructor(_selfId, _params, _config, kafkaMessageStream) {
        this._selfId = _selfId;
        this._params = _params;
        this._config = _config;
        this.kafkaMessageStream = kafkaMessageStream;
        this._kafkaMessageStream = kafkaMessageStream;
    }
    get params() {
        return this._params;
    }
    get id() {
        return this._selfId;
    }
    async getKafkaMessageStream() {
        if (!this._kafkaMessageStream) {
            this._kafkaMessageStream = await Kafka_1.default.messages(this._selfId, this._config);
        }
        return this._kafkaMessageStream;
    }
    async requestCommitment() {
        if (this._params.isCommitted) {
            return new CommitmentConfirmation_1.default(new CommitmentConfirmationParams_1.default({ bidId: this._params.id }));
        }
        const bidderId = this._params.id; // Channel#6
        const commitmentRequestParams = new CommitmentRequestParams_1.default({ neederId: this._selfId });
        const kafkaMessageStream = await this.getKafkaMessageStream(); // Channel#3
        const protocolTypesMap = new CommitmentConfirmationParams_1.default({}).getProtocolTypes();
        const commitmentConfirmationParamsStream = kafkaMessageStream.filterType(protocolTypesMap, protocolTypesMap.messages);
        const commitmentConfirmation = commitmentConfirmationParamsStream.filter((commitmentConfirmationParams) => commitmentConfirmationParams.bidId === this._params.id)
            .map((commitmentParams) => {
            this._params.isCommitted = true;
            return new CommitmentConfirmation_1.default(commitmentParams);
        }).first().toPromise();
        await Kafka_1.default.sendParams(bidderId, commitmentRequestParams, this._config);
        return commitmentConfirmation;
    }
    /**
     * @method accept Used to accept a bid and create a new mission, the mission will sent to the bid provider.
     * @param missionParams the mission parameters.
     * @param walletPrivateKey Ethereum wallet private key, to charge for the mission.
     * @returns the created mission.
     */
    // TODO: think why do mission params is a parameter of this method? does mission params have another source of information except bid params?
    async accept(missionParams, walletPrivateKey) {
        if (!this._params.isCommitted) {
            throw new Error(`Bidder hasn't confirmed commitment to this bid! please get commitment confirmation first.`);
        }
        const bidderId = this._params.id; // Channel#6
        missionParams.id = Contracts_1.default.generateMissionId(this._config); // Channel#4
        missionParams.price = this._params.price;
        missionParams.neederDavId = this._params.neederDavId;
        missionParams.vehicleId = this._params.vehicleId;
        this._missionId = missionParams.id;
        try {
            await Contracts_1.default.approveMission(missionParams.neederDavId, walletPrivateKey, this._config);
        }
        catch (err) {
            throw new Error(`Fail to approve mission, you might not have enough DAV Tokens: ${err}`);
        }
        try {
            await Kafka_1.default.createTopic(missionParams.id, this._config);
        }
        catch (err) {
            // TODO: move this general message to kafka.createTopic
            throw new Error(`Fail to create a topic: ${err}`);
        }
        await Kafka_1.default.sendParams(bidderId, missionParams, this._config);
        const mission = new Mission_1.default(this._missionId, null, missionParams, this._config);
        return mission;
    }
    /**
     * @method sendMessage Used to send a message to the bid provider.
     * @param messageParams the message parameters.
     */
    async sendMessage(messageParams) {
        if (this._selfId === this._params.id) {
            throw new Error(`You cannot send message to your own channel`);
        }
        messageParams.senderId = this._selfId; // Channel#3
        return await Kafka_1.default.sendParams(this._params.id, messageParams, this._config); // Channel#6
    }
    /**
     * @method messages Used to subscribe for messages for the current bid.
     * @param filterType (optional) array of the expected message params object type.
     * @returns Observable for messages subscription.
     */
    async messages(filterType) {
        const kafkaMessageStream = await this.getKafkaMessageStream(); // Channel#6 or Channel#3
        const protocolTypesMap = this._params.getProtocolTypes();
        const messageParamsStream = kafkaMessageStream.filterType(protocolTypesMap, filterType || protocolTypesMap.messages);
        const messageStream = messageParamsStream.map((params) => new Message_1.default(this._selfId, params, this._config));
        return common_types_1.Observable.fromObservable(messageStream, messageParamsStream.topic);
    }
    /**
     * @method missions Used to subscribe for missions.
     * @returns Observable for missions subscription.
     */
    async missions() {
        const kafkaMessageStream = await this.getKafkaMessageStream(); // Channel#6
        const protocolTypesMap = this._params.getProtocolTypes();
        const missionParamsStream = kafkaMessageStream.filterType(protocolTypesMap, protocolTypesMap.missions);
        const missionStream = missionParamsStream
            .map(async (params) => {
            this._missionId = Kafka_1.default.generateTopicId();
            await Kafka_1.default.createTopic(this._missionId, this._config); // Channel #5
            return new Mission_1.default(this._missionId, params.id, params, this._config);
        })
            .map((promise) => common_types_1.Observable.fromPromise(promise))
            .mergeAll()
            .do((mission) => {
            const message = new MissionPeerIdMessageParams_1.default({ senderId: this._missionId });
            mission.sendMessage(message);
        });
        return common_types_1.Observable.fromObservable(missionStream, missionParamsStream.topic);
    }
    /**
     * @method commitmentRequests Used to subscribe for commitmentRequests for current bid.
     * @returns Observable of commitmentRequests.
     */
    async commitmentRequests() {
        const kafkaMessageStream = await this.getKafkaMessageStream(); // Channel#6
        const typesMap = new CommitmentRequestParams_1.default({}).getProtocolTypes();
        const commitmentRequestParamsStream = kafkaMessageStream.filterType(typesMap, typesMap.messages);
        const commitmentRequestStream = commitmentRequestParamsStream.map((commitmentRequestParams) => new CommitmentRequest_1.default(this._selfId, commitmentRequestParams, this._config));
        return common_types_1.Observable.fromObservable(commitmentRequestStream, this._selfId);
    }
}
exports.default = Bid;

//# sourceMappingURL=Bid.js.map
