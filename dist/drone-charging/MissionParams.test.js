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
            protocol: 'drone_charging',
            type: 'mission',
            id: undefined,
            neederDavId: undefined,
            price: undefined,
            vehicleId: undefined,
        };
    });
    describe('serialize method', () => {
        it('should return a serialized mission params object', () => {
            expect(missionParams.serialize()).toEqual(serializedMissionParams);
        });
    });
    describe('deserialize method', () => {
        it('should return a MissionParams instance', () => {
            const missionParamsObject = new MissionParams_1.default();
            missionParamsObject.deserialize(serializedMissionParams);
            expect(missionParamsObject).toBeInstanceOf(MissionParams_1.default);
        });
        it('should return the correct deserialized parameters', () => {
            const missionParamsObject = new MissionParams_1.default();
            missionParamsObject.deserialize(serializedMissionParams);
            expect(missionParamsObject).toEqual(missionParams);
        });
    });
});

//# sourceMappingURL=MissionParams.test.js.map
