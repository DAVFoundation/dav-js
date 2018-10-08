"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NeedParams_1 = require("./NeedParams");
const enums_1 = require("./enums");
describe('NeedParams class', () => {
    const needParams = new NeedParams_1.default({
        location: {
            lat: 32.050382,
            long: 34.766149,
        },
        startAt: 1535441613658,
        dimensions: {
            length: 1,
            width: 1,
            height: 1,
            weight: 2,
        },
        batteryCapacity: 40,
        currentBatteryCharge: 10,
        energySource: enums_1.EnergySources.Hydro,
        amenities: [enums_1.Amenities.Park],
    });
    needParams.id = 'TOPIC_ID';
    needParams.davId = 'davId';
    const serializedNeedParams = {
        ttl: undefined,
        protocol: 'vessel_charging',
        type: 'need',
        id: 'TOPIC_ID',
        location: { latitude: 32.050382, longitude: 34.766149 },
        davId: 'davId',
        startAt: 1535441613658,
        dimensions: {
            length: 1,
            width: 1,
            height: 1,
            weight: 2,
        },
        batteryCapacity: 40,
        currentBatteryCharge: 10,
        energySource: 'hydro',
        amenities: [5],
    };
    describe('serialize method', () => {
        it('should return serialized need params object with the current values', () => {
            expect(needParams.serialize()).toEqual(serializedNeedParams);
        });
    });
    describe('deserialize method', () => {
        it('should return NeedParams instance with the current parameters', () => {
            const needParamsObject = new NeedParams_1.default();
            needParamsObject.deserialize(serializedNeedParams);
            expect(needParamsObject).toEqual(needParams);
        });
    });
});

//# sourceMappingURL=NeedParams.test.js.map
