"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./Config");
const BidParams_1 = require("./ride-hailing/BidParams");
const Price_1 = require("./Price");
const MessageParams_1 = require("./drone-charging/MessageParams");
const MissionParams_1 = require("./drone-charging/MissionParams");
const rxjs_1 = require("rxjs");
const Mission_1 = require("./Mission");
const common_enums_1 = require("./common-enums");
const CommitmentConfirmation_1 = require("./CommitmentConfirmation");
const CommitmentConfirmationParams_1 = require("./CommitmentConfirmationParams");
const CommitmentRequestParams_1 = require("./CommitmentRequestParams");
const CommitmentRequest_1 = require("./CommitmentRequest");
const KafkaMessageStream_1 = require("./KafkaMessageStream");
const common_types_1 = require("./common-types");
const AxiosMock_1 = require("./mocks/AxiosMock");
describe('Bid class', () => {
    const config = new Config_1.default({});
    const selfId = 'SELF_ID';
    jest.doMock('./ride-hailing/BidParams');
    let bidParams;
    let messageParams = new MessageParams_1.default({
        senderId: 'sender',
    });
    const missionParams = new MissionParams_1.default({
        id: 'MISSION_ID',
        neederDavId: 'DAV_ID',
        vehicleId: 'DAV_ID',
        price: '100',
    });
    const kafkaError = { msg: 'Kafka error' };
    const forContextSwitch = () => {
        return new Promise((resolve, reject) => {
            jest.useRealTimers();
            setTimeout(resolve, 0);
            jest.useFakeTimers();
        });
    };
    beforeEach(() => {
        jest.resetAllMocks();
        jest.resetModules();
        bidParams = new BidParams_1.default({
            id: 'BID_TOPIC_ID',
            price: new Price_1.default('3', common_enums_1.PriceType.flat),
            vehicleId: '34',
        });
        messageParams = new MessageParams_1.default({
            senderId: 'sender',
        });
    });
    describe('requestCommitment method', () => {
        let confirmationParams;
        beforeEach(() => {
            confirmationParams = new CommitmentConfirmationParams_1.default({
                bidId: bidParams.id,
            });
        });
        it('should return confirmation for already confirmed bid', async () => {
            // tslint:disable-next-line:variable-name
            const Bid = (await Promise.resolve().then(() => require('./Bid'))).default;
            const bid = new Bid(selfId, bidParams, config);
            await expect(bid.requestCommitment()).resolves.toEqual(new CommitmentConfirmation_1.default(confirmationParams));
        });
        it('should return confirmation after bidder had confirmed the bid', async () => {
            const kafkaMessageStreamMock = {
                filterType: jest.fn(() => rxjs_1.Observable.from([confirmationParams])),
            };
            const kafkaMock = {
                sendParams: jest.fn((topicId, requestParams, configuration) => Promise.resolve()),
                messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
            };
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Bid = (await Promise.resolve().then(() => require('./Bid'))).default;
            bidParams.isCommitted = false;
            const bid = new Bid(selfId, bidParams, config);
            await expect(bid.requestCommitment()).resolves.toEqual(new CommitmentConfirmation_1.default(new CommitmentConfirmationParams_1.default({ bidId: bidParams.id })));
            expect(kafkaMock.sendParams).toHaveBeenCalledTimes(1);
            expect(kafkaMessageStreamMock.filterType).toHaveBeenCalledTimes(1);
        });
        it('should return confirmation after bidder had confirmed the bid, and another bid confirmation was filtered', async () => {
            const anotherBidConfirmationParams = new CommitmentConfirmationParams_1.default({
                bidId: 'anotherBid',
            });
            const kafkaMessageStreamMock = {
                filterType: jest.fn(() => rxjs_1.Observable.from([anotherBidConfirmationParams, confirmationParams])),
            };
            const kafkaMock = {
                sendParams: jest.fn((topicId, requestParams, configuration) => Promise.resolve()),
                messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
            };
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Bid = (await Promise.resolve().then(() => require('./Bid'))).default;
            bidParams.isCommitted = false;
            const bid = new Bid(selfId, bidParams, config);
            await expect(bid.requestCommitment()).resolves.toEqual(new CommitmentConfirmation_1.default(new CommitmentConfirmationParams_1.default({ bidId: bidParams.id })));
            expect(kafkaMock.sendParams).toHaveBeenCalledTimes(1);
            expect(kafkaMessageStreamMock.filterType).toHaveBeenCalledTimes(1);
        });
        it('should throw due to kafka error in sendParams', async () => {
            const kafkaMock = {
                sendParams: jest.fn((topicId, requestParams, configuration) => Promise.reject('kafka error')),
                messages: jest.fn(() => Promise.resolve(new KafkaMessageStream_1.default(common_types_1.Observable.fromObservable(rxjs_1.Observable.from([]), '1000')))),
            };
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Bid = (await Promise.resolve().then(() => require('./Bid'))).default;
            bidParams.isCommitted = false;
            const bid = new Bid(selfId, bidParams, config);
            await expect(bid.requestCommitment()).rejects.toBe('kafka error');
        });
        xit('should throw due to kafka error in messages', async () => {
            const kafkaMessageStreamMock = {
                filterType: jest.fn(() => rxjs_1.Observable.from([confirmationParams])),
            };
            const kafkaMock = {
                sendParams: jest.fn((topicId, requestParams, configuration) => Promise.resolve()),
                messages: jest.fn(() => Promise.reject('kafka error')),
            };
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Bid = (await Promise.resolve().then(() => require('./Bid'))).default;
            bidParams.isCommitted = false;
            const bid = new Bid(selfId, bidParams, config);
            await expect(bid.requestCommitment()).rejects.toBe('kafka error');
            expect(kafkaMock.sendParams).toHaveBeenCalledTimes(1);
        });
    });
    describe('accept method', () => {
        it('should not throw any errors when get valid input and no errors', async () => {
            const kafkaMock = {
                createTopic: jest.fn((topicId, configParam) => Promise.resolve()),
                sendParams: jest.fn((needId, mParams, configParam) => Promise.resolve()),
            };
            const contractsMock = {
                approveMission: jest.fn(() => Promise.resolve()),
                generateMissionId: jest.fn(() => 'topicId'),
            };
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            jest.doMock('./Contracts', () => ({ default: contractsMock }));
            // tslint:disable-next-line:variable-name
            const Bid = (await Promise.resolve().then(() => require('./Bid'))).default;
            const bid = new Bid(selfId, bidParams, config);
            await expect(bid.accept(missionParams, 'Private_key')).resolves.toEqual(new Mission_1.default(missionParams.id, null, missionParams, config));
            expect(contractsMock.generateMissionId).toHaveBeenCalled();
            expect(kafkaMock.createTopic).toHaveBeenCalledWith('topicId', config);
            expect(kafkaMock.sendParams).toHaveBeenCalledWith(bidParams.id, missionParams, config);
        });
        it('should throw due to topic creation failure', async () => {
            const kafkaMock = {
                createTopic: jest.fn((topicId, configParam) => Promise.reject(kafkaError)),
            };
            const contractsMock = {
                approveMission: jest.fn(() => Promise.resolve()),
                generateMissionId: jest.fn(() => 'topicId'),
            };
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            jest.doMock('./Contracts', () => ({ default: contractsMock }));
            // tslint:disable-next-line:variable-name
            const Bid = (await Promise.resolve().then(() => require('./Bid'))).default;
            const bid = new Bid(selfId, bidParams, config);
            await expect(bid.accept(missionParams, 'Private_key')).rejects.toThrow(`Fail to create a topic: ${kafkaError}`);
            expect(kafkaMock.createTopic).toHaveBeenCalledWith('topicId', config);
        });
        xit('should throw due to kafka send message failure', async () => {
            // Arrange
            const kafkaMock = {
                createTopic: jest.fn((topicId, configParam) => Promise.resolve()),
                sendParams: jest.fn((needId, mParams, configParam) => Promise.reject(kafkaError)),
            };
            const contractsMock = {
                generateMissionId: jest.fn(() => 'topicId'),
            };
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            jest.doMock('./Contracts', () => ({ default: contractsMock }));
            // tslint:disable-next-line:variable-name
            const Bid = (await Promise.resolve().then(() => require('./Bid'))).default;
            const bid = new Bid('needId', bidParams, config);
            await expect(bid.accept(missionParams, 'Private_key')).rejects.toBe(kafkaError);
            expect(kafkaMock.createTopic).toHaveBeenCalledWith('topicId', config);
            expect(kafkaMock.sendParams).toHaveBeenCalledWith(bidParams.id, missionParams, config);
        });
        it('should throw to due to unconfirmed bid', async () => {
            // tslint:disable-next-line:variable-name
            const Bid = (await Promise.resolve().then(() => require('./Bid'))).default;
            bidParams.isCommitted = false;
            const bid = new Bid(selfId, bidParams, config);
            await expect(bid.accept(missionParams, 'Private_key')).rejects.toThrow(`Bidder hasn't confirmed commitment to this bid! please get commitment confirmation first.`);
        });
    });
    describe('missions method', () => {
        const missionParams1 = new MissionParams_1.default({
            id: 'MISSION_ID_1',
            neederDavId: 'DAV_ID',
            vehicleId: 'DAV_ID',
            price: '100',
        });
        const missionParams2 = new MissionParams_1.default({
            id: 'MISSION_ID_2',
            neederDavId: 'DAV_ID',
            vehicleId: 'DAV_ID',
            price: '100',
        });
        const missionParams3 = new MissionParams_1.default({
            id: 'MISSION_ID_3',
            neederDavId: 'DAV_ID',
            vehicleId: 'DAV_ID',
            price: '100',
        });
        const TOPIC_ID = 'TOPIC_ID';
        beforeEach(() => {
            jest.clearAllMocks();
            jest.resetAllMocks();
            jest.resetModules();
            jest.doMock('axios', () => ({
                default: AxiosMock_1.default,
            }));
        });
        xit('should receive missions and call relevant functions', async () => {
            const kafkaMessageStreamMock = {
                filterType: jest.fn(() => rxjs_1.Observable.from([missionParams1, missionParams2, missionParams3])),
            };
            const kafkaMock = {
                generateTopicId: jest.fn(() => TOPIC_ID),
                sendParams: jest.fn(params => Promise.resolve(true)),
                createTopic: jest.fn(() => Promise.resolve()),
                messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
            };
            jest.doMock('./KafkaMessageStream', () => ({
                default: jest.fn().mockImplementation(() => kafkaMessageStreamMock),
            }));
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Bid = (await Promise.resolve().then(() => require('./Bid'))).default;
            const bid = new Bid(TOPIC_ID, bidParams, config);
            const spy = jest.fn();
            const missions = await bid.missions();
            missions.subscribe(spy);
            await forContextSwitch();
            expect(spy.mock.calls.length).toBe(3);
            expect(spy.mock.calls[0][0]).toEqual(new Mission_1.default(TOPIC_ID, missionParams1.id, missionParams1, config));
            expect(spy.mock.calls[1][0]).toEqual(new Mission_1.default(TOPIC_ID, missionParams2.id, missionParams2, config));
        });
        xit('should receive missions with specified topicId and relevant functions', async () => {
            const kafkaMessageStreamMock = {
                filterType: jest.fn(() => rxjs_1.Observable.from([missionParams1, missionParams2, missionParams3])),
            };
            const kafkaMock = {
                generateTopicId: jest.fn(() => TOPIC_ID),
                sendParams: jest.fn(params => Promise.resolve(true)),
                createTopic: jest.fn(() => Promise.resolve()),
                messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
            };
            jest.doMock('./KafkaMessageStream', () => ({
                default: jest.fn().mockImplementation(() => kafkaMessageStreamMock),
            }));
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            const anotherTopic = 'anotherTopic';
            // tslint:disable-next-line:variable-name
            const Bid = (await Promise.resolve().then(() => require('./Bid'))).default;
            const bid = new Bid(anotherTopic, bidParams, config);
            const spy = jest.fn();
            const missions = await bid.missions();
            missions.subscribe(spy);
            await forContextSwitch();
            expect(spy.mock.calls.length).toBe(3);
            expect(spy.mock.calls[0][0]).toEqual(new Mission_1.default(TOPIC_ID, missionParams1.id, missionParams1, config));
            expect(spy.mock.calls[1][0]).toEqual(new Mission_1.default(TOPIC_ID, missionParams2.id, missionParams2, config));
            expect(kafkaMock.generateTopicId).toHaveBeenCalled();
            expect(kafkaMock.createTopic).toHaveBeenCalled();
        });
        xit('should receive Kafka error event', async () => {
            // kafkaMock.paramsStream.mockImplementation(() => Promise.resolve(Observable.fromPromise(Promise.reject(kafkaError))));
            // tslint:disable-next-line:variable-name
            const Bid = (await Promise.resolve().then(() => require('./Bid'))).default;
            const bid = new Bid('needId', bidParams, config);
            const successSpy = jest.fn();
            const errorSpy = jest.fn();
            const missions = await bid.missions();
            missions.subscribe(successSpy, errorSpy);
            await forContextSwitch();
            expect(successSpy.mock.calls.length).toBe(0);
            expect(errorSpy.mock.calls.length).toBe(1);
            expect(errorSpy.mock.calls[0][0]).toBe(kafkaError);
        });
    });
    describe('messages method', () => {
        it('should get one message when get valid input and no errors', async () => {
            const kafkaMessageStreamMock = {
                filterType: jest.fn(() => rxjs_1.Observable.from([messageParams])),
            };
            const kafkaMock = {
                messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
            };
            jest.doMock('./KafkaMessageStream', () => ({
                default: jest.fn().mockImplementation(() => kafkaMessageStreamMock),
            }));
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Bid = (await Promise.resolve().then(() => require('./Bid'))).default;
            const bid = new Bid(selfId, bidParams, config);
            const messagesStream = await bid.messages();
            const message = await new Promise((resolve, reject) => {
                messagesStream.subscribe(next => {
                    resolve(next);
                }, error => {
                    reject(error);
                });
            });
            expect(message.selfId).toBe(selfId);
            expect(kafkaMock.messages).toHaveBeenCalledWith(selfId, config);
        });
        xit('should throw because paramsStream is throwing', async () => {
            const kafkaMock = {
                generateTopicId: () => 'topicId',
                createTopic: () => Promise.resolve(),
                sendParams: () => Promise.resolve(),
                paramsStream: jest.fn((topicId, configParam) => Promise.reject('kafka error')),
            };
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            const contractsMock = {
                approveMission: () => Promise.resolve(),
                startMission: () => Promise.resolve(),
            };
            jest.doMock('./Contracts', () => ({ default: contractsMock }));
            // tslint:disable-next-line:variable-name
            const Bid = (await Promise.resolve().then(() => require('./Bid'))).default;
            const bid = new Bid(selfId, bidParams, config);
            // await expect(bid.messages()).rejects.toEqual('kafka error');
            expect(kafkaMock.paramsStream).toHaveBeenCalledWith(bidParams.id, config);
        });
    });
    describe('sendMessage method', () => {
        const kafkaMock = {
            sendParams: jest.fn(() => Promise.resolve()),
        };
        beforeAll(() => {
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
        });
        it('should succeed and call relevant function', async () => {
            // tslint:disable-next-line:variable-name
            const Bid = (await Promise.resolve().then(() => require('./Bid'))).default;
            const bid = new Bid(selfId, bidParams, config);
            await expect(bid.sendMessage(messageParams)).resolves.toBeUndefined();
            expect(kafkaMock.sendParams).toHaveBeenCalledWith(bidParams.id, messageParams, config);
        });
        it('should throw because topic id == selfId', async () => {
            // tslint:disable-next-line:variable-name
            const Bid = (await Promise.resolve().then(() => require('./Bid'))).default;
            const bid = new Bid(bidParams.id, bidParams, config);
            await expect(bid.sendMessage(messageParams)).rejects.toThrow('You cannot send message to your own channel');
        });
    });
    describe('commitmentRequests method', () => {
        let requestParams;
        beforeEach(() => {
            requestParams = new CommitmentRequestParams_1.default({ neederId: 'neederId' });
        });
        it('should return valid commitment requests when there are no kafka errors', async () => {
            const kafkaMessageStreamMock = {
                filterType: jest.fn(() => rxjs_1.Observable.from([requestParams])),
            };
            const kafkaMock = {
                messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
            };
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Bid = (await Promise.resolve().then(() => require('./Bid'))).default;
            const bid = new Bid(bidParams.id, bidParams, config);
            const commitmentRequestStream = await bid.commitmentRequests();
            const commitmentRequest = await commitmentRequestStream.toPromise();
            expect(commitmentRequest).toEqual(new CommitmentRequest_1.default(bidParams.id, requestParams, config));
            expect(kafkaMock.messages).toHaveBeenCalledTimes(1);
        });
        it('should throw error due to kafka error', async () => {
            const kafkaMock = {
                messages: jest.fn(() => Promise.reject('kafka error')),
            };
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Bid = (await Promise.resolve().then(() => require('./Bid'))).default;
            const bid = new Bid(bidParams.id, bidParams, config);
            await expect(bid.commitmentRequests()).rejects.toBe('kafka error');
        });
    });
});

//# sourceMappingURL=Bid.test.js.map
