"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NeedParams_1 = require("./NeedParams");
const VehicleTypes_1 = require("./VehicleTypes");
describe('NeedParams class', () => {
    let needParams;
    let serializedNeedParams;
    beforeEach(() => {
        needParams = new NeedParams_1.default({
            endLocation: {
                lat: 32.050382,
                long: 34.766149,
            },
            location: {
                lat: 32.050382,
                long: 34.766149,
            },
            maxAltitude: 6000,
            startAt: undefined,
            startLocation: {
                lat: 32.050382,
                long: 34.766149,
            },
            vehicleType: VehicleTypes_1.default.drone,
        });
        serializedNeedParams = {
            davId: undefined,
            endLocation: {
                lat: 32.050382,
                long: 34.766149,
            },
            id: undefined,
            location: {
                latitude: 32.050382,
                longitude: 34.766149,
            },
            maxAltitude: 6000,
            protocol: 'drone_delivery',
            startLocation: {
                lat: 32.050382,
                long: 34.766149,
            },
            type: 'need',
            ttl: undefined,
            vehicleType: VehicleTypes_1.default.drone,
        };
    });
    describe('serialize method', () => {
        it('should return serialized NeedParams object with the current values', () => {
            expect(needParams.serialize()).toEqual(serializedNeedParams);
        });
    });
    describe('deserialize method', () => {
        it('should return a NeedParams instance', () => {
            const needParamsObject = new NeedParams_1.default();
            needParamsObject.deserialize(serializedNeedParams);
            expect(needParamsObject).toBeInstanceOf(NeedParams_1.default);
        });
        it('should return deserialize NeedParams instance with current parameters', () => {
            const needParamsObject = new NeedParams_1.default();
            needParamsObject.deserialize(serializedNeedParams);
            expect(needParamsObject).toEqual(needParams);
        });
    });
});

//# sourceMappingURL=NeedParams.test.js.map
