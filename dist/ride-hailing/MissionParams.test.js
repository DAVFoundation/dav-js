"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MissionParams_1 = require("./MissionParams");
describe('MissionParams class', () => {
    let missionParams;
    let serializedMissionParams;
    beforeEach(() => {
        missionParams = new MissionParams_1.default({});
        serializedMissionParams = {
            ttl: undefined,
            protocol: 'ride_hailing',
            type: 'mission',
            price: undefined,
            vehicleId: undefined,
        };
    });
    describe('serialize method', () => {
        it('should return serialized MissionParams object with the current values', () => {
            expect(missionParams.serialize()).toEqual(serializedMissionParams);
        });
    });
    describe('deserialize method', () => {
        it('should return serialized MissionParams instance with the current parameters', () => {
            const missionParamsObject = new MissionParams_1.default();
            missionParamsObject.deserialize(serializedMissionParams);
            expect(missionParamsObject).toEqual(missionParams);
        });
    });
});

//# sourceMappingURL=MissionParams.test.js.map
