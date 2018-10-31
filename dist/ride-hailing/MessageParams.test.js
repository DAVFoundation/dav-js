"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageParams_1 = require("./MessageParams");
describe('MessageParams class', () => {
    let messageParams;
    let serializedMessageParams;
    beforeEach(() => {
        messageParams = new MessageParams_1.default({
            senderId: undefined,
        });
        serializedMessageParams = {
            missionStatus: undefined,
            protocol: 'ride_hailing',
            type: 'message',
            senderId: undefined,
            ttl: undefined,
        };
    });
    describe('serialize method', () => {
        it('should return serialized MessageParams object with the current values', () => {
            expect(messageParams.serialize()).toEqual(serializedMessageParams);
        });
    });
    describe('deserialize method', () => {
        it('should return a MessageParms instance', () => {
            const messageParamsObject = new MessageParams_1.default();
            messageParamsObject.deserialize(serializedMessageParams);
            expect(messageParamsObject).toBeInstanceOf(MessageParams_1.default);
        });
        it('should return deserialize MessageParams instance with the current parameters', () => {
            const messageParamsObject = new MessageParams_1.default();
            messageParamsObject.deserialize(serializedMessageParams);
            expect(messageParamsObject).toEqual(messageParams);
        });
    });
});

//# sourceMappingURL=MessageParams.test.js.map
