"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DroneStatusMessageParams_1 = require("./DroneStatusMessageParams");
describe('MessageParams class', () => {
    const messageParams = new DroneStatusMessageParams_1.default({
        location: {
            lat: 32.050382,
            long: 34.766149,
        },
    });
    const serializedMessageParams = {
        senderId: undefined,
        protocol: 'drone_charging',
        ttl: undefined,
        type: 'drone_status_message',
        location: { lat: 32.050382, long: 34.766149 },
    };
    describe('serialize method', () => {
        it('should return serialized need params object with the current values', () => {
            expect(messageParams.serialize()).toEqual(serializedMessageParams);
        });
    });
    describe('deserialize method', () => {
        it('should return NeedParams instance with the current parameters', () => {
            const messageParamsObject = new DroneStatusMessageParams_1.default();
            messageParamsObject.deserialize(serializedMessageParams);
            expect(messageParamsObject).toEqual(messageParams);
        });
    });
});

//# sourceMappingURL=DroneStatusMessageParams.test.js.map
