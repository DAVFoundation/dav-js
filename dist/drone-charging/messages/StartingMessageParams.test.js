"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StartingMessageParams_1 = require("./StartingMessageParams");
describe('StartingMessageParams class', () => {
    let startingMessageParams;
    let serializedMessageParams;
    beforeEach(() => {
        startingMessageParams = new StartingMessageParams_1.default({});
        serializedMessageParams = {
            ttl: undefined,
            protocol: 'drone_charging',
            type: 'starting_message',
            senderId: undefined,
        };
    });
    describe('serialize method', () => {
        it('should return serialized message params object with the current values', () => {
            expect(startingMessageParams.serialize()).toEqual(serializedMessageParams);
        });
    });
    describe('deserialize method', () => {
        it('should return a MessageParams instance', () => {
            const startingMessageObj = new StartingMessageParams_1.default();
            startingMessageObj.deserialize(serializedMessageParams);
            expect(startingMessageObj).toBeInstanceOf(StartingMessageParams_1.default);
        });
        it('should return a correct MessageParams object', () => {
            const startingMessageObj = new StartingMessageParams_1.default({});
            startingMessageObj.deserialize(serializedMessageParams);
            expect(startingMessageObj).toEqual(startingMessageParams);
        });
    });
});

//# sourceMappingURL=StartingMessageParams.test.js.map
