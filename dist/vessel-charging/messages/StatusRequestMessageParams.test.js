"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StatusRequestMessageParams_1 = require("./StatusRequestMessageParams");
describe('MessageParams class', () => {
    const messageParams = new StatusRequestMessageParams_1.default({ senderId: 'senderId' }); // <-- Causing TypeError
    const serializedMessageParams = {
        type: 'status_request_message',
        senderId: 'senderId',
    };
    describe('serialize method', () => {
        xit('should return serialized message params object with the current values', () => {
            expect(messageParams.serialize()).toEqual(serializedMessageParams);
        });
    });
    describe('deserialize method', () => {
        it('should return MessageParams instance with the current parameters', () => {
            const messageParamsObject = new StatusRequestMessageParams_1.default();
            messageParamsObject.deserialize(serializedMessageParams);
            expect(messageParamsObject).toEqual(messageParams);
        });
    });
});

//# sourceMappingURL=StatusRequestMessageParams.test.js.map
