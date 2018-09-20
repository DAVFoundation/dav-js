"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./Config");
const Need_1 = require("./Need");
const NeedFilterParams_1 = require("./vessel-charging/NeedFilterParams");
const NeedParams_1 = require("./vessel-charging/NeedParams");
const MissionParams_1 = require("./vessel-charging/MissionParams");
const StatusRequestMessageParams_1 = require("./vessel-charging/messages/StatusRequestMessageParams");
const BidParams_1 = require("./vessel-charging/BidParams");
const common_types_1 = require("./common-types");
const Message_1 = require("./Message");
const Mission_1 = require("./Mission");
const Bid_1 = require("./Bid");
const AxiosMock_1 = require("./mocks/AxiosMock");
describe('Identity class', () => {
    const TOPIC_ID = 'TOPIC_ID';
    const kafkaError = { msg: 'Kafka error' };
    const davNodeError = { msg: 'Dav node error' };
    const config = new Config_1.default({});
    const needFilterParams = new NeedFilterParams_1.default({ location: { lat: 10, long: 10 }, radius: 1000 });
    const needParams = new NeedParams_1.default({
        location: {
            lat: 32.050382,
            long: 34.766149,
        },
    });
    const bidParams = new BidParams_1.default({
        vehicleId: 'DAV_ID',
        availableFrom: Date.now(),
        price: '100',
    });
    const missionParams = new MissionParams_1.default({
        id: 'MISSION_ID',
        neederDavId: 'DAV_ID',
        vehicleId: 'DAV_ID',
        price: '100',
    });
    const forContextSwitch = () => {
        return new Promise((resolve, reject) => {
            jest.useRealTimers();
            setTimeout(resolve, 0);
            jest.useFakeTimers();
        });
    };
    describe('publishNeed method', () => {
        const kafkaMock = {
            generateTopicId: jest.fn(() => TOPIC_ID),
            createTopic: jest.fn(() => Promise.resolve()),
        };
        beforeAll(() => {
            jest.doMock('./Kafka', () => ({
                default: kafkaMock,
            }));
            jest.doMock('axios', () => ({
                default: AxiosMock_1.default,
            }));
        });
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('should call relevant functions and return valid need', async () => {
            // tslint:disable-next-line:variable-name
            const Identity = (await Promise.resolve().then(() => require('./Identity'))).default;
            const identity = new Identity('id', 'davId', config);
            const need = new Need_1.default(TOPIC_ID, needParams, config);
            await expect(identity.publishNeed(needParams)).resolves.toEqual(need);
            expect(kafkaMock.generateTopicId).toHaveBeenCalled();
            expect(kafkaMock.createTopic).toHaveBeenCalledWith(TOPIC_ID, config);
            expect(AxiosMock_1.default.post).toHaveBeenCalled();
            expect(AxiosMock_1.default.post).toHaveBeenCalledWith(`${config.apiSeedUrls[0]}/publishNeed/${TOPIC_ID}`, needParams.serialize());
        });
        it('should fail due to dav node exception', async () => {
            AxiosMock_1.default.post.mockImplementation(() => Promise.reject(davNodeError));
            // tslint:disable-next-line:variable-name
            const Identity = (await Promise.resolve().then(() => require('./Identity'))).default;
            const identity = new Identity('id', 'davId', config);
            await expect(identity.publishNeed(needParams)).rejects.toThrow(`Fail to publish need: ${davNodeError}`);
        });
        it('should fail due to topic creation failure', async () => {
            kafkaMock.createTopic.mockImplementation(() => Promise.reject(kafkaError));
            // tslint:disable-next-line:variable-name
            const Identity = (await Promise.resolve().then(() => require('./Identity'))).default;
            const identity = new Identity('id', 'davId', config);
            await expect(identity.publishNeed(needParams)).rejects.toThrow(`Fail to create a topic: ${kafkaError}`);
            expect(AxiosMock_1.default.post).not.toHaveBeenCalled();
        });
    });
    describe('needsForType method', () => {
        const needParams1 = new NeedParams_1.default({
            location: {
                lat: 32.050382,
                long: 34.766149,
            },
        });
        const needParams2 = new NeedParams_1.default({
            location: {
                lat: 32.050382,
                long: 34.766149,
            },
        });
        const needParams3 = new NeedParams_1.default({
            location: {
                lat: 32.050382,
                long: 34.766149,
            },
        });
        beforeAll(() => {
            jest.doMock('axios', () => ({
                default: AxiosMock_1.default,
            }));
        });
        beforeEach(() => {
            jest.clearAllMocks();
            jest.resetAllMocks();
            jest.resetModules();
        });
        it('should receive needs and relevant functions', async () => {
            const kafkaMessageStreamMock = {
                filterType: jest.fn(() => common_types_1.Observable.from([needParams1, needParams2, needParams3])),
            };
            const kafkaMock = {
                generateTopicId: jest.fn(() => TOPIC_ID),
                createTopic: jest.fn(() => Promise.resolve()),
                messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
            };
            jest.doMock('./KafkaMessageStream', () => ({
                default: jest.fn().mockImplementation(() => kafkaMessageStreamMock),
            }));
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Identity = (await Promise.resolve().then(() => require('./Identity'))).default;
            const identity = new Identity('selfId', 'davId', config);
            const spy = jest.fn();
            const needs = await identity.needsForType(needFilterParams, NeedParams_1.default);
            needs.subscribe(spy);
            expect(spy.mock.calls.length).toBe(3);
            expect(spy.mock.calls[0][0]).toEqual(new Need_1.default(TOPIC_ID, needParams1, config));
            expect(spy.mock.calls[1][0]).toEqual(new Need_1.default(TOPIC_ID, needParams2, config));
            expect(kafkaMock.generateTopicId).toHaveBeenCalled();
            expect(kafkaMock.createTopic).toHaveBeenCalledWith(TOPIC_ID, config);
            expect(AxiosMock_1.default.post).toHaveBeenCalledWith(`${config.apiSeedUrls[0]}/needsForType/${TOPIC_ID}`, needFilterParams.serialize());
        });
        // xit('should receive Kafka error event', async () => {
        //   kafkaMock.paramsStream.mockImplementation(() => Observable.fromPromise(Promise.reject(kafkaError)));
        //   // tslint:disable-next-line:variable-name
        //   const Identity: any = (await import('./Identity')).default;
        //   const identity = new Identity('selfId', 'davId', config);
        //   const successSpy = jest.fn();
        //   const errorSpy = jest.fn();
        //   const needs = await identity.needsForType(needFilterParams, NeedParams);
        //   needs.subscribe(successSpy, errorSpy);
        //   await forContextSwitch();
        //   expect(successSpy.mock.calls.length).toBe(0);
        //   expect(errorSpy.mock.calls.length).toBe(1);
        //   expect(errorSpy.mock.calls[0][0]).toBe(kafkaError);
        //   expect(kafkaMock.generateTopicId).toHaveBeenCalled();
        //   expect(kafkaMock.createTopic).toHaveBeenCalledWith(TOPIC_ID, config);
        //   expect(AxiosMock.post).toHaveBeenCalledWith(`${config.apiSeedUrls[0]}/needsForType/${TOPIC_ID}`, needFilterParams.serialize());
        // });
        it('should fail due to dav node exception', async () => {
            const kafkaMock = {
                generateTopicId: jest.fn(() => TOPIC_ID),
                createTopic: jest.fn(() => Promise.resolve()),
            };
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            AxiosMock_1.default.post.mockImplementation(() => Promise.reject(davNodeError));
            // tslint:disable-next-line:variable-name
            const Identity = (await Promise.resolve().then(() => require('./Identity'))).default;
            const identity = new Identity('selfId', 'davId', config);
            await expect(identity.needsForType(needFilterParams, NeedParams_1.default)).rejects.toThrow(`Needs registration failed: ${davNodeError}`);
            expect(kafkaMock.generateTopicId).toHaveBeenCalled();
            expect(kafkaMock.createTopic).toHaveBeenCalledWith(TOPIC_ID, config);
            expect(AxiosMock_1.default.post).toHaveBeenCalledWith(`${config.apiSeedUrls[0]}/needsForType/${TOPIC_ID}`, needFilterParams.serialize());
        });
        xit('should fail due to topic creation failure', async () => {
            const kafkaMock = {
                generateTopicId: jest.fn(() => TOPIC_ID),
                createTopic: jest.fn(() => Promise.resolve()),
            };
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            kafkaMock.createTopic.mockImplementation(() => Promise.reject(kafkaError));
            // tslint:disable-next-line:variable-name
            const Identity = (await Promise.resolve().then(() => require('./Identity'))).default;
            const identity = new Identity('selfId', 'davId', config);
            await expect(identity.needsForType(needFilterParams, NeedParams_1.default)).rejects.toThrow(`Fail to create a topic: ${kafkaError}`);
            expect(kafkaMock.generateTopicId).toHaveBeenCalled();
            expect(kafkaMock.createTopic).toHaveBeenCalledWith(TOPIC_ID, config);
            expect(AxiosMock_1.default.post).toHaveBeenCalledWith(`${config.apiSeedUrls[0]}/needsForType/${TOPIC_ID}`, needFilterParams.serialize());
        });
    });
    xdescribe('missions method', () => {
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
        beforeEach(() => {
            jest.clearAllMocks();
            jest.resetAllMocks();
            jest.resetModules();
            jest.doMock('axios', () => ({
                default: AxiosMock_1.default,
            }));
        });
        it('should receive missions and relevant functions', async () => {
            const kafkaMessageStreamMock = {
                filterType: jest.fn(() => common_types_1.Observable.from([missionParams1, missionParams2, missionParams3])),
            };
            const kafkaMock = {
                generateTopicId: jest.fn(() => TOPIC_ID),
                createTopic: jest.fn(() => Promise.resolve()),
                messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
            };
            jest.doMock('./KafkaMessageStream', () => ({
                default: jest.fn().mockImplementation(() => kafkaMessageStreamMock),
            }));
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Identity = (await Promise.resolve().then(() => require('./Identity'))).default;
            const identity = new Identity('selfId', 'davId', config);
            const spy = jest.fn();
            const missions = await identity.missions(MissionParams_1.default);
            missions.subscribe(spy);
            await forContextSwitch();
            expect(spy.mock.calls.length).toBe(3);
            expect(spy.mock.calls[0][0]).toEqual(new Mission_1.default(TOPIC_ID, missionParams1.id, missionParams1, config));
            expect(spy.mock.calls[1][0]).toEqual(new Mission_1.default(TOPIC_ID, missionParams2.id, missionParams2, config));
            expect(kafkaMock.generateTopicId).toHaveBeenCalled();
            expect(kafkaMock.createTopic).toHaveBeenCalledWith(TOPIC_ID, config);
        });
        it('should receive missions with specified topicId and relevant functions', async () => {
            const kafkaMessageStreamMock = {
                filterType: jest.fn(() => common_types_1.Observable.from([missionParams1, missionParams2, missionParams3])),
            };
            const kafkaMock = {
                generateTopicId: jest.fn(() => TOPIC_ID),
                createTopic: jest.fn(() => Promise.resolve()),
                messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
            };
            jest.doMock('./KafkaMessageStream', () => ({
                default: jest.fn().mockImplementation(() => kafkaMessageStreamMock),
            }));
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            const anotherTopic = 'anotherTopic';
            // tslint:disable-next-line:variable-name
            const Identity = (await Promise.resolve().then(() => require('./Identity'))).default;
            const identity = new Identity('selfId', 'davId', config);
            const spy = jest.fn();
            const missions = await identity.missions(MissionParams_1.default, anotherTopic);
            missions.subscribe(spy);
            await forContextSwitch();
            expect(spy.mock.calls.length).toBe(3);
            expect(spy.mock.calls[0][0]).toEqual(new Mission_1.default(anotherTopic, missionParams1.id, missionParams1, config));
            expect(spy.mock.calls[1][0]).toEqual(new Mission_1.default(anotherTopic, missionParams2.id, missionParams2, config));
            expect(kafkaMock.generateTopicId).not.toHaveBeenCalled();
            expect(kafkaMock.createTopic).not.toHaveBeenCalled();
        });
        xit('should receive Kafka error event', async () => {
            // kafkaMock.paramsStream.mockImplementation(() => Promise.resolve(Observable.fromPromise(Promise.reject(kafkaError))));
            // tslint:disable-next-line:variable-name
            const Identity = (await Promise.resolve().then(() => require('./Identity'))).default;
            const identity = new Identity('selfId', 'davId', config);
            const successSpy = jest.fn();
            const errorSpy = jest.fn();
            const missions = await identity.missions();
            missions.subscribe(successSpy, errorSpy);
            await forContextSwitch();
            expect(successSpy.mock.calls.length).toBe(0);
            expect(errorSpy.mock.calls.length).toBe(1);
            expect(errorSpy.mock.calls[0][0]).toBe(kafkaError);
        });
        it('should fail due to topic creation failure', async () => {
            const kafkaMock = {
                generateTopicId: jest.fn(() => TOPIC_ID),
                createTopic: jest.fn(() => Promise.reject(kafkaError)),
                messages: jest.fn(),
            };
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Identity = (await Promise.resolve().then(() => require('./Identity'))).default;
            const identity = new Identity('selfId', 'davId', config);
            await forContextSwitch();
            await expect(identity.missions()).rejects.toThrow(`Fail to create a topic: ${kafkaError}`);
            expect(kafkaMock.generateTopicId).toHaveBeenCalled();
            expect(kafkaMock.createTopic).toHaveBeenCalledWith(TOPIC_ID, config);
            expect(kafkaMock.messages).not.toHaveBeenCalled();
        });
    });
    describe('need method', () => {
        it('should success, validate need', async () => {
            // tslint:disable-next-line:variable-name
            const Identity = (await Promise.resolve().then(() => require('./Identity'))).default;
            const identity = new Identity('selfId', 'davId', config);
            const need = identity.need('needSelfId', needParams);
            expect(need).toEqual(new Need_1.default('needSelfId', needParams, config));
        });
    });
    describe('bid method', () => {
        it('should success, validate bid', async () => {
            // tslint:disable-next-line:variable-name
            const Identity = (await Promise.resolve().then(() => require('./Identity'))).default;
            const identity = new Identity('selfId', 'davId', config);
            const bid = identity.bid('bidId', bidParams);
            expect(bid).toEqual(new Bid_1.default('bidId', bidParams, config));
        });
    });
    describe('mission method', () => {
        it('should success, validate mission', async () => {
            // tslint:disable-next-line:variable-name
            const Identity = (await Promise.resolve().then(() => require('./Identity'))).default;
            const identity = new Identity('selfId', 'davId', config);
            const mission = identity.mission('missionSelfId', 'missionPeerId', missionParams);
            expect(mission).toEqual(new Mission_1.default('missionSelfId', 'missionPeerId', missionParams, config));
        });
    });
    describe('messages method', () => {
        beforeAll(() => {
            jest.doMock('axios', () => ({
                default: AxiosMock_1.default,
            }));
        });
        beforeEach(() => {
            jest.clearAllMocks();
            jest.resetAllMocks();
            jest.resetModules();
        });
        xit('should receive message events', async () => {
            const messageParams1 = new StatusRequestMessageParams_1.default({ senderId: 'SOURCE_ID_1' });
            const messageParams2 = new StatusRequestMessageParams_1.default({ senderId: 'SOURCE_ID_2' });
            const messageParams3 = new StatusRequestMessageParams_1.default({ senderId: 'SOURCE_ID_3' });
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
            const Identity = (await Promise.resolve().then(() => require('./Identity'))).default;
            const identity = new Identity('selfId', 'davId', config);
            const spy = jest.fn();
            const messages = await identity.messages(StatusRequestMessageParams_1.default);
            messages.subscribe(spy);
            expect(spy.mock.calls.length).toBe(3);
            expect(spy.mock.calls[0][0]).toEqual(new Message_1.default('selfId', messageParams1, config));
            expect(spy.mock.calls[1][0]).toEqual(new Message_1.default('selfId', messageParams2, config));
            expect(spy.mock.calls[2][0]).toEqual(new Message_1.default('selfId', messageParams3, config));
        });
        xit('should receive error event', async () => {
            // kafkaMock.paramsStream.mockImplementation(() => Promise.resolve(Observable.fromPromise(Promise.reject(kafkaError))));
            // tslint:disable-next-line:variable-name
            const Identity = (await Promise.resolve().then(() => require('./Identity'))).default;
            const identity = new Identity('selfId', 'davId', config);
            const successSpy = jest.fn();
            const errorSpy = jest.fn();
            const messages = await identity.messages();
            messages.subscribe(successSpy, errorSpy);
            await forContextSwitch();
            expect(successSpy.mock.calls.length).toBe(0);
            expect(errorSpy).toHaveBeenCalled();
            expect(errorSpy.mock.calls[0][0]).toBe(kafkaError);
        });
    });
});

//# sourceMappingURL=Identity.test.js.map
