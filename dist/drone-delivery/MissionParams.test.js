"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MissionParams_1 = require("./MissionParams");
describe('MissionParams class', () => {
    let missionParams;
    let serializedMissionParams;
    beforeEach(() => {
        missionParams = new MissionParams_1.default({
            id: 'TOPIC_ID',
            price: ['66666666'],
            vehicleId: 'PROVIDER_DAV_ID',
            neederDavId: 'CONSUMER_DAV_ID'
        });
        serializedMissionParams = {
            protocol: 'drone_delivery',
            type: 'mission',
            id: 'TOPIC_ID',
            price: ['66666666'],
            vehicleId: 'PROVIDER_DAV_ID',
            neederDavId: 'CONSUMER_DAV_ID',
            ttl: undefined
        };
    });
    describe('serialize method', () => {
        it('should return serialized MissionParams object with the current values', () => {
            expect(missionParams.serialize()).toEqual(serializedMissionParams);
        });
    });
    describe('deserialize method', () => {
        it('should return a MissionParams instance', () => {
            const missionParamsObject = new MissionParams_1.default();
            missionParamsObject.deserialize(serializedMissionParams);
            expect(missionParamsObject).toBeInstanceOf(MissionParams_1.default);
        });
        it('should return deserialize MissionParams instance with current parameters', () => {
            const missionParamsObject = new MissionParams_1.default();
            missionParamsObject.deserialize(serializedMissionParams);
            expect(missionParamsObject).toEqual(missionParams);
        });
    });
});

//# sourceMappingURL=MissionParams.test.js.map
