"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChargingCompleteMessageParams_1 = require("./ChargingCompleteMessageParams");
describe('MessageParams class', () => {
    let messageParams;
    let serializedMessageParams;
    beforeEach(() => {
        messageParams = new ChargingCompleteMessageParams_1.default({
            senderId: 'TOPIC_ID',
        });
        serializedMessageParams = {
            ttl: undefined,
            protocol: 'drone_charging',
            type: 'charging_complete_message',
            senderId: 'TOPIC_ID',
        };
    });
    describe('serialize method', () => {
        it('should return serialized message params object with the current values', () => {
            expect(messageParams.serialize()).toEqual(serializedMessageParams);
        });
    });
    describe('deserialize method', () => {
        it('should return a MessageParams instance', () => {
            const messageParamsObject = new ChargingCompleteMessageParams_1.default();
            messageParamsObject.deserialize(serializedMessageParams);
            expect(messageParamsObject).toBeInstanceOf(ChargingCompleteMessageParams_1.default);
        });
        it('should return the correct deserialized parameters', () => {
            const messageParamsObject = new ChargingCompleteMessageParams_1.default();
            messageParamsObject.deserialize(serializedMessageParams);
            expect(messageParamsObject).toEqual(messageParams);
        });
    });
});

//# sourceMappingURL=ChargingCompleteMessageParams.test.js.map
