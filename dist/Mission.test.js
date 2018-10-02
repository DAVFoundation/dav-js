"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./Config");
const MessageParams_1 = require("./drone-charging/MessageParams");
const Bid_1 = require("./Bid");
const BidParams_1 = require("./drone-charging/BidParams");
const MissionParams_1 = require("./drone-charging/MissionParams");
const common_enums_1 = require("./common-enums");
const Price_1 = require("./Price");
const common_types_1 = require("./common-types");
const Message_1 = require("./Message");
describe('Mission class', () => {
    const configuration = new Config_1.default({});
    const bidParams = new BidParams_1.default({
        id: 'BID_TOPIC_ID',
        price: new Price_1.default('3', common_enums_1.PriceType.flat),
        vehicleId: '34',
    });
    const missionParams = new MissionParams_1.default({
        id: 'SOURCE_ID_1',
        neederDavId: 'DAV_ID',
        vehicleId: 'DAV_ID',
        price: new Price_1.default('100', common_enums_1.PriceType.flat),
    });
    const selfId = 'selfId';
    const bid = new Bid_1.default(selfId, bidParams, configuration);
    const kafkaError = { msg: 'KAFKA_ERROR' };
    const forContextSwitch = () => {
        return new Promise((resolve, reject) => {
            jest.useRealTimers();
            setTimeout(resolve, 0);
            jest.useFakeTimers();
        });
    };
    describe('sendMessage method', () => {
        beforeEach(() => {
            jest.resetAllMocks();
            jest.resetModules();
        });
        const kafkaMessageStreamMock = {
            filterType: jest.fn(() => common_types_1.Observable.from([new MessageParams_1.default({ senderId: 'SOURCE_ID_1' })])),
        };
        it('should succeed, validate kafka mock send message', async () => {
            const kafkaMock = {
                sendParams: () => Promise.resolve(true),
            };
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Mission = (await Promise.resolve().then(() => require('./Mission'))).default;
            const mission = new Mission(selfId, missionParams.id, missionParams, configuration);
            await expect(mission.sendMessage(new MessageParams_1.default({}))).resolves.toBeDefined();
        });
        it('should fail due to kafka exception', async () => {
            const kafkaMock = {
                sendParams: () => Promise.reject(kafkaError),
            };
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Mission = (await Promise.resolve().then(() => require('./Mission'))).default;
            const mission = new Mission(selfId, missionParams.id, missionParams, configuration);
            await expect(mission.sendMessage(new MessageParams_1.default({}))).rejects.toBe(kafkaError);
        });
        it('should call to Kafka sendParams', async () => {
            const kafkaMock = {
                sendParams: jest.fn(params => Promise.resolve(true)),
            };
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Mission = (await Promise.resolve().then(() => require('./Mission'))).default;
            const mission = new Mission(selfId, missionParams.id, missionParams, configuration);
            const messageParams = new MessageParams_1.default({});
            await mission.sendMessage(messageParams);
            expect(kafkaMock.sendParams).toHaveBeenCalledWith(missionParams.id, messageParams, configuration);
        });
        xit('test send for consumer', async () => {
            const kafkaMock = {
                messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
                sendParams: () => Promise.resolve(true),
            };
            // tslint:disable-next-line:variable-name
            const Mission = (await Promise.resolve().then(() => require('./Mission'))).default;
            const mission = new Mission(missionParams.id, null, missionParams, configuration);
            const messageParams = new MessageParams_1.default({});
            // TODO
        });
    });
    describe('messages method', () => {
        beforeEach(() => {
            jest.resetAllMocks();
            jest.resetModules();
        });
        it('should receive message events', async () => {
            const messageParams1 = new MessageParams_1.default({ senderId: 'SOURCE_ID_1' });
            const messageParams2 = new MessageParams_1.default({ senderId: 'SOURCE_ID_2' });
            const messageParams3 = new MessageParams_1.default({ senderId: 'SOURCE_ID_3' });
            const kafkaMessageStreamMock = {
                filterType: jest.fn(() => common_types_1.Observable.from([messageParams1, messageParams2, messageParams3])),
            };
            const kafkaMock = {
                messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
            };
            jest.doMock('./KafkaMessageStream', () => ({
                default: jest.fn().mockImplementation(() => kafkaMessageStreamMock),
            }));
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Mission = (await Promise.resolve().then(() => require('./Mission'))).default;
            const mission = new Mission(selfId, null, missionParams, configuration);
            const spy = jest.fn();
            const messages = await mission.messages();
            messages.subscribe(spy);
            expect(spy.mock.calls.length).toBe(3);
            expect(spy.mock.calls[0][0]).toEqual(new Message_1.default(selfId, messageParams1, configuration));
            expect(spy.mock.calls[1][0]).toEqual(new Message_1.default(selfId, messageParams2, configuration));
            expect(spy.mock.calls[2][0]).toEqual(new Message_1.default(selfId, messageParams3, configuration));
        });
        xit('should receive error event', async () => {
            jest.doMock('./Kafka', () => ({
                default: {
                    paramsStream: async () => common_types_1.Observable.fromPromise(Promise.reject(kafkaError)),
                },
            }));
            // tslint:disable-next-line:variable-name
            const Mission = (await Promise.resolve().then(() => require('./Mission'))).default;
            const mission = new Mission(missionParams.id, missionParams, configuration);
            const successSpy = jest.fn();
            const errorSpy = jest.fn();
            const messages = await mission.messages();
            messages.subscribe(successSpy, errorSpy);
            await forContextSwitch();
            expect(successSpy.mock.calls.length).toBe(0);
            expect(errorSpy.mock.calls.length).toBe(1);
            expect(errorSpy.mock.calls[0][0]).toBe(kafkaError);
        });
    });
    describe('signContract method', () => {
        const privateKey = 'valid private key';
        const contractsMock = {
            approveMission: jest.fn((dav, key, configParam) => Promise.resolve('')),
            startMission: jest.fn((missionId, dav, key, vId, price, configParam) => Promise.resolve('')),
        };
        beforeAll(() => {
            jest.resetAllMocks();
            jest.resetModules();
            jest.doMock('./Contracts', () => ({ default: contractsMock }));
        });
        it('should not throw any errors when get valid input and no errors', async () => {
            // tslint:disable-next-line:variable-name
            const Mission = (await Promise.resolve().then(() => require('./Mission'))).default;
            const mission = new Mission(missionParams.id, null, missionParams, configuration);
            await mission.signContract(privateKey);
            expect(contractsMock.startMission).toHaveBeenCalledWith(missionParams.id, missionParams.neederDavId, privateKey, missionParams.vehicleId, missionParams.price, configuration);
        });
        it('should fail due to blockchain exception', async () => {
            const web3Error = { msg: 'WEB3_ERROR' };
            contractsMock.startMission.mockImplementation(() => Promise.reject(web3Error));
            jest.doMock('./Contracts', () => ({ default: contractsMock }));
            // tslint:disable-next-line:variable-name
            const Mission = (await Promise.resolve().then(() => require('./Mission'))).default;
            const mission = new Mission(missionParams.id, null, missionParams, configuration);
            await expect(mission.signContract(privateKey)).rejects.toThrow(`Fail to sign contract ${web3Error}`);
        });
    });
    describe('finalizeMission method', () => {
        const WALLET_PRIVATE_KEY = 'WALLET_PRIVET_KEY';
        beforeEach(() => {
            jest.resetAllMocks();
            jest.resetModules();
        });
        it('should succeed with finalize mission transaction receipt', async () => {
            const transactionReceipt = { transactionHash: 'TRANSACTION_HASH' };
            const contractsMock = {
                finalizeMission: () => Promise.resolve(transactionReceipt),
            };
            jest.doMock('./Contracts', () => ({ default: contractsMock }));
            // tslint:disable-next-line:variable-name
            const Mission = (await Promise.resolve().then(() => require('./Mission'))).default;
            const mission = new Mission(missionParams.id, null, missionParams, configuration);
            await expect(mission.finalizeMission(WALLET_PRIVATE_KEY)).resolves.toBe(transactionReceipt);
        });
        it('should fail due to blockchain exception', async () => {
            const web3Error = { msg: 'WEB3_ERROR' };
            const contractsMock = {
                finalizeMission: () => Promise.reject(web3Error),
            };
            jest.doMock('./Contracts', () => ({ default: contractsMock }));
            // tslint:disable-next-line:variable-name
            const Mission = (await Promise.resolve().then(() => require('./Mission'))).default;
            const mission = new Mission(missionParams.id, null, missionParams, configuration);
            await expect(mission.finalizeMission(WALLET_PRIVATE_KEY)).rejects.toThrow(`Fail to finalize mission ${web3Error}`);
        });
    });
});

//# sourceMappingURL=Mission.test.js.map
