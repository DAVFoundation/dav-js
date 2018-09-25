"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_types_1 = require("./common-types");
const Message_1 = require("./Message");
const MissionPeerIdMessageParams_1 = require("./MissionPeerIdMessageParams");
const Contracts_1 = require("./Contracts");
const Kafka_1 = require("./Kafka");
const KafkaMessageFactory_1 = require("./KafkaMessageFactory");
/**
 * @class Mission class represent an approved mission.
 */
class Mission {
    constructor(_selfId, _peerId, _params, _config) {
        this._selfId = _selfId;
        this._peerId = _peerId;
        this._params = _params;
        this._config = _config;
    }
    get params() {
        return this._params;
    }
    get id() {
        return this._selfId;
    }
    get peerId() {
        return this._peerId;
    }
    async getPeerId() {
        const kafkaMessageStream = await Kafka_1.default.messages(this._selfId, this._config); // Channel#4 or Channel#6
        const messageParamsStream = kafkaMessageStream.filterType(KafkaMessageFactory_1.default.instance.getMessageTypes(MissionPeerIdMessageParams_1.default._protocol, KafkaMessageFactory_1.MessageCategories.Message));
        const messageStream = messageParamsStream.do((messageParams) => {
            this._peerId = messageParams.senderId;
        }).map((messageParams) => messageParams.senderId).first().toPromise();
        return messageStream;
    }
    /**
     * @method signContract Used to transfer tokens to the basicMission contract in order to start the mission.
     * @param walletPrivateKey Ethereum wallet private key, to charge for the mission.
     * @returns Ethereum transaction receipt.
     */
    async signContract(walletPrivateKey) {
        try {
            const transactionReceipt = await Contracts_1.default.startMission(this._params.id, this._params.neederDavId, walletPrivateKey, this._params.vehicleId, this._params.price, this._config);
            return transactionReceipt;
        }
        catch (err) {
            throw new Error(`Fail to sign contract ${err}`);
        }
    }
    /**
     * @method finalizeMission Used to approve the mission is completed,
     * and transfer the tokens from the basicMission contract to the service provider.
     * @param walletPrivateKey Ethereum wallet private key, to charge for the mission.
     * @returns Ethereum transaction receipt object.
     */
    async finalizeMission(walletPrivateKey) {
        try {
            const transactionReceipt = await Contracts_1.default.finalizeMission(this._params.id, this._params.neederDavId, walletPrivateKey, this._config);
            return transactionReceipt;
        }
        catch (err) {
            throw new Error(`Fail to finalize mission ${err}`);
        }
    }
    /**
     * @method sendMessage Used to send message to the service consumer.
     * @param params message parameters.
     */
    async sendMessage(params) {
        if (!this._peerId) {
            await this.getPeerId();
        }
        params.senderId = this._selfId;
        return await Kafka_1.default.sendParams(this._peerId, params, this._config); // Channel#4
    }
    /**
     * @method messages Used to subscribe for messages from the service provider.
     * @param filterType (optional) array of the expected message params object type.
     * @returns Observable object.
     */
    async messages(filterType) {
        const kafkaMessageStream = await Kafka_1.default.messages(this._selfId, this._config); // Channel#4 or Channel#6
        const messageParamsStream = kafkaMessageStream.filterType(filterType ||
            KafkaMessageFactory_1.default.instance.getMessageTypes(this._params.protocol, KafkaMessageFactory_1.MessageCategories.Message));
        const messageStream = messageParamsStream.map((params) => new Message_1.default(this._selfId, params, this._config));
        return common_types_1.Observable.fromObservable(messageStream, messageParamsStream.topic);
    }
}
exports.default = Mission;

//# sourceMappingURL=Mission.js.map
