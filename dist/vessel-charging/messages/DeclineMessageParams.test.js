"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DeclineMessageParams_1 = require("./DeclineMessageParams");
describe('DeclineMessageParams class', () => {
    let declineMessageParams;
    let serializedMessageParams;
    beforeEach(() => {
        declineMessageParams = new DeclineMessageParams_1.default({});
        serializedMessageParams = {
            ttl: undefined,
            protocol: 'vessel_charging',
            type: 'decline_message',
            senderId: undefined,
        };
    });
    describe('serialize method', () => {
        it('should return serialized message params object with the current values', () => {
            expect(declineMessageParams.serialize()).toEqual(serializedMessageParams);
        });
    });
    describe('deserialize method', () => {
        it('should return deserialized message params with the current parameters', () => {
            const declineMessageObj = new DeclineMessageParams_1.default({});
            declineMessageObj.deserialize(serializedMessageParams);
            expect(declineMessageObj).toEqual(declineMessageParams);
        });
    });
});

//# sourceMappingURL=DeclineMessageParams.test.js.map
