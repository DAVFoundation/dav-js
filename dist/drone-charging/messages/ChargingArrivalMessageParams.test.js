"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChargingArrivalMessageParams_1 = require("./ChargingArrivalMessageParams");
describe('ChargingArrivalMessageParams class', () => {
    const chargingArrivalMessageParams = new ChargingArrivalMessageParams_1.default({});
    const serializedMessageParams = {
        ttl: undefined,
        protocol: 'drone_charging',
        type: 'charging_arrival_message',
        senderId: undefined,
    };
    describe('serialize method', () => {
        it('should return serialized message params object with the current values', () => {
            expect(chargingArrivalMessageParams.serialize()).toEqual(serializedMessageParams);
        });
    });
    describe('deserialize method', () => {
        it('should return deserialized message params with the current parameters', () => {
            const messageParamsObject = new ChargingArrivalMessageParams_1.default({});
            messageParamsObject.deserialize(serializedMessageParams);
            expect(messageParamsObject).toEqual(chargingArrivalMessageParams);
        });
        it('should return a MessageParams instance', () => {
            const messageParamsObject = new ChargingArrivalMessageParams_1.default({});
            messageParamsObject.deserialize(serializedMessageParams);
            expect(messageParamsObject).toBeInstanceOf(ChargingArrivalMessageParams_1.default);
        });
    });
});

//# sourceMappingURL=ChargingArrivalMessageParams.test.js.map
