"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./Config");
const BidParams_1 = require("./drone-charging/BidParams");
const NeedParams_1 = require("./drone-charging/NeedParams");
const Price_1 = require("./Price");
const common_enums_1 = require("./common-enums");
const Message_1 = require("./Message");
const common_types_1 = require("./common-types");
const MessageParams_1 = require("./drone-charging/MessageParams");
const forContextSwitch = () => {
    return new Promise((resolve, reject) => {
        jest.useRealTimers();
        setTimeout(resolve, 0);
        jest.useFakeTimers();
    });
};
describe('Need class', () => {
    const config = new Config_1.default({});
    const selfId = 'SELF_ID';
    const topicId = 'TOPIC_ID';
    const needParams = new NeedParams_1.default({});
    const kafkaError = { msg: 'Kafka error' };
    let bidParams = new BidParams_1.default({ id: 'BID_ID', price: new Price_1.default('3', common_enums_1.PriceType.flat), vehicleId: 'DAV_ID' });
    bidParams.id = 'bidSource';
    describe('createBid method', () => {
        const kafkaMock = {
            generateTopicId: jest.fn(() => topicId),
            createTopic: jest.fn(() => Promise.resolve()),
            sendParams: jest.fn(() => Promise.resolve()),
            messages: jest.fn(() => Promise.resolve({ filterType: jest.fn(() => common_types_1.Observable.from([])) })),
        };
        beforeEach(() => {
            jest.resetModules();
            jest.clearAllMocks();
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
        });
        it('should create correct bid when input is valid', async () => {
            // tslint:disable-next-line:variable-name
            const Need = (await Promise.resolve().then(() => require('./Need'))).default;
            const need = new Need(selfId, needParams, config);
            const bid = await need.createBid(bidParams);
            expect(bid.id).toBe(topicId);
            expect(bid.params).toBe(bidParams);
            expect(kafkaMock.createTopic).toHaveBeenCalledWith(topicId, config);
            expect(kafkaMock.sendParams).toHaveBeenCalledWith(needParams.id, bidParams, config);
        });
        it('should throw exception when sendParams throws error', async () => {
            kafkaMock.sendParams.mockImplementation(() => Promise.reject(kafkaError));
            // tslint:disable-next-line:variable-name
            const Need = (await Promise.resolve().then(() => require('./Need'))).default;
            const need = new Need(selfId, needParams, config);
            await expect(need.createBid(bidParams)).rejects.toEqual(kafkaError);
            expect(kafkaMock.createTopic).toHaveBeenCalledWith(topicId, config);
        });
        it('should throw exception when createTopic throws error', async () => {
            kafkaMock.createTopic.mockImplementation(() => Promise.reject(kafkaError));
            // tslint:disable-next-line:variable-name
            const Need = (await Promise.resolve().then(() => require('./Need'))).default;
            const need = new Need(selfId, needParams, config);
            await expect(need.createBid(bidParams)).rejects.toThrow(`Fail to create a topic: ${kafkaError}`);
            expect(kafkaMock.createTopic).toHaveBeenCalledWith(topicId, config);
            expect(kafkaMock.sendParams).not.toHaveBeenCalled();
        });
    });
    describe('bids method', () => {
        beforeEach(() => {
            jest.resetModules();
            jest.clearAllMocks();
            bidParams = new BidParams_1.default({ id: 'BID_ID', price: new Price_1.default('3', common_enums_1.PriceType.flat), vehicleId: 'DAV_ID' });
        });
        it('should create bid observable with one message', async () => {
            const kafkaMessageStreamMock = {
                filterType: jest.fn(() => common_types_1.Observable.from([bidParams])),
            };
            const kafkaMock = {
                messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
            };
            jest.doMock('./KafkaMessageStream', () => ({
                default: jest.fn().mockImplementation(() => kafkaMessageStreamMock),
            }));
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Need = (await Promise.resolve().then(() => require('./Need'))).default;
            const need = new Need(selfId, needParams, config);
            const bids = await need.bids();
            const bid = await new Promise((resolve, reject) => {
                bids.subscribe((next) => resolve(next), (error) => reject(error));
            });
            expect(kafkaMock.messages).toHaveBeenCalledWith(selfId, config);
            expect(bid.params.id).toBe('BID_ID');
            expect(bid.params.price[0].value).toBe('3');
        });
        xit('should throw error when paramsStream throws error', async () => {
            // kafkaMock.messages.mockImplementation(() => Observable.fromPromise(Promise.reject(kafkaError)));
            // tslint:disable-next-line:variable-name
            const Need = (await Promise.resolve().then(() => require('./Need'))).default;
            const need = new Need(selfId, needParams, config);
            const bids = await need.bids();
            const bid = new Promise((resolve, reject) => {
                bids.subscribe((next) => resolve(next), (error) => reject(error));
            });
            await expect(bid).rejects.toEqual(kafkaError);
            // expect(kafkaMock.messages).toHaveBeenCalledWith(needParams.id, config);
        });
    });
    describe('sendMessage method', () => {
        beforeEach(() => {
            jest.resetAllMocks();
            jest.resetModules();
        });
        it('should success, validate kafka mock send message', async () => {
            const kafkaMock = {
                sendParams: () => Promise.resolve(true),
            };
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Need = (await Promise.resolve().then(() => require('./Need'))).default;
            const need = new Need(selfId, needParams, config);
            await expect(need.sendMessage(new MessageParams_1.default({}))).resolves.toBeDefined();
        });
        it('should fail due to kafka exception', async () => {
            const kafkaMock = {
                sendParams: () => Promise.reject(kafkaError),
            };
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Need = (await Promise.resolve().then(() => require('./Need'))).default;
            const need = new Need(selfId, needParams, config);
            await expect(need.sendMessage(new MessageParams_1.default({}))).rejects.toBe(kafkaError);
        });
        it('should call to Kafka sendParams', async () => {
            const kafkaMock = {
                sendParams: jest.fn((params) => Promise.resolve(true)),
            };
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Need = (await Promise.resolve().then(() => require('./Need'))).default;
            const need = new Need(selfId, needParams, config);
            const messageParams = new MessageParams_1.default({});
            await need.sendMessage(messageParams);
            expect(kafkaMock.sendParams).toHaveBeenCalledWith(needParams.id, messageParams, config);
        });
        it('should throw because topic id == selfId', async () => {
            // tslint:disable-next-line:variable-name
            const Need = (await Promise.resolve().then(() => require('./Need'))).default;
            const need = new Need(needParams.id, needParams, config);
            const messageParams = new MessageParams_1.default({});
            await expect(need.sendMessage(messageParams)).rejects.toThrow('You cannot send message to your own channel');
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
                filterType: jest.fn(() => common_types_1.Observable.from([
                    messageParams1, messageParams2, messageParams3,
                ])),
            };
            const kafkaMock = {
                messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
            };
            jest.doMock('./KafkaMessageStream', () => ({
                default: jest.fn().mockImplementation(() => kafkaMessageStreamMock),
            }));
            jest.doMock('./Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Need = (await Promise.resolve().then(() => require('./Need'))).default;
            const need = new Need(selfId, needParams, config);
            const spy = jest.fn();
            const messages = await need.messages();
            messages.subscribe(spy);
            expect(spy.mock.calls.length).toBe(3);
            expect(spy.mock.calls[0][0]).toEqual(new Message_1.default(selfId, messageParams1, config));
            expect(spy.mock.calls[1][0]).toEqual(new Message_1.default(selfId, messageParams2, config));
            expect(spy.mock.calls[2][0]).toEqual(new Message_1.default(selfId, messageParams3, config));
        });
        xit('should receive error event', async () => {
            jest.doMock('./Kafka', () => ({
                default: { paramsStream: async () => common_types_1.Observable.fromPromise(Promise.reject(kafkaError)) },
            }));
            // tslint:disable-next-line:variable-name
            const Need = (await Promise.resolve().then(() => require('./Need'))).default;
            const need = new Need(selfId, needParams, config);
            const successSpy = jest.fn();
            const errorSpy = jest.fn();
            const messages = await need.messages();
            messages.subscribe(successSpy, errorSpy);
            await forContextSwitch();
            expect(successSpy.mock.calls.length).toBe(0);
            expect(errorSpy.mock.calls.length).toBe(1);
            expect(errorSpy.mock.calls[0][0]).toBe(kafkaError);
        });
    });
});

//# sourceMappingURL=Need.test.js.map
