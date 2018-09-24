"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VehicleLocationMessageParams_1 = require("./VehicleLocationMessageParams");
describe('MessageParams class', () => {
    const messageParams = new VehicleLocationMessageParams_1.default({
        vehicleLocation: {
            lat: 32.050382,
            long: 34.766149,
        },
    });
    const serializedMessageParams = {
        missionStatus: 'on_the_way',
        protocol: 'ride_hailing',
        ttl: undefined,
        type: 'vehicle_location_message',
        vehicleLocation: { lat: 32.050382, long: 34.766149 },
    };
    describe('serialize method', () => {
        it('should return serialized need params object with the current values', () => {
            expect(messageParams.serialize()).toEqual(serializedMessageParams);
        });
    });
    describe('deserialize method', () => {
        it('should return NeedParams instance with the current parameters', () => {
            const messageParamsObject = new VehicleLocationMessageParams_1.default();
            messageParamsObject.deserialize(serializedMessageParams);
            expect(messageParamsObject).toEqual(messageParams);
        });
    });
});

//# sourceMappingURL=VehicleLocationMessageParams.test.js.map
