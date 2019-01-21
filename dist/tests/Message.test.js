"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../Config");
const MessageParams_1 = require("../drone-charging/MessageParams");
describe('Message class', () => {
    const configuration = new Config_1.default({});
    const messageContent = new MessageParams_1.default({ senderId: 'peerId' });
    const selfId = 'selfId';
    describe('respond method', () => {
        const kafkaError = { msg: 'KAFKA_ERROR' };
        beforeEach(() => {
            jest.resetAllMocks();
            jest.resetModules();
        });
        it('should succeed, validate kafka mock send message', async () => {
            const kafkaMock = {
                sendParams: () => Promise.resolve(true),
            };
            jest.doMock('../Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Message = (await Promise.resolve().then(() => require('../Message'))).default;
            const message = new Message(selfId, messageContent, configuration);
            await expect(message.respond(new MessageParams_1.default({ senderId: selfId }))).resolves.toBeDefined();
        });
        it('should fail due to kafka exception', async () => {
            const kafkaMock = {
                sendParams: () => Promise.reject(kafkaError),
            };
            jest.doMock('../Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Message = (await Promise.resolve().then(() => require('../Message'))).default;
            const message = new Message(selfId, messageContent, configuration);
            await expect(message.respond(new MessageParams_1.default({ senderId: selfId }))).rejects.toBe(kafkaError);
        });
        it('should call to Kafka sendParams', async () => {
            const kafkaMock = {
                sendParams: jest.fn(() => Promise.resolve(true)),
            };
            jest.doMock('../Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Message = (await Promise.resolve().then(() => require('../Message'))).default;
            const message = new Message(selfId, messageContent, configuration);
            const messageParams = new MessageParams_1.default({});
            await message.respond(messageParams);
            expect(kafkaMock.sendParams).toHaveBeenCalledWith('peerId', messageParams, configuration);
        });
        it('should call to Kafka sendParams with message params that contain selfId', async () => {
            const kafkaMock = {
                sendParams: jest.fn(params => Promise.resolve(true)),
            };
            jest.doMock('../Kafka', () => ({ default: kafkaMock }));
            // tslint:disable-next-line:variable-name
            const Message = (await Promise.resolve().then(() => require('../Message'))).default;
            const message = new Message(selfId, messageContent, configuration);
            const messageParams = new MessageParams_1.default({});
            await message.respond(messageParams);
            expect(kafkaMock.sendParams.mock.calls[0][1].senderId).toBe(selfId);
        });
    });
});

//# sourceMappingURL=Message.test.js.map
