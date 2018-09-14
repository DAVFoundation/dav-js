import MissionParams from './MissionParams';

describe('MissionParams class', () => {
  const missionParams = new MissionParams({});

  const serializedMissionParams: any = {
    ttl: undefined,
    protocol: 'boat_charging',
    type: 'mission',
    id: undefined,
    neederDavId: undefined,
    price: undefined,
    vehicleId: undefined,
  };

  describe('serialize method', () => {
    it('should return a serialized mission params object', () => {
      expect(missionParams.serialize()).toEqual(serializedMissionParams);
    });
  });

  describe('deserialize method', () => {
    it('should return a MissionParams instance', () => {
      const missionParamsObject = new MissionParams();
      missionParamsObject.deserialize(serializedMissionParams);
      expect(missionParamsObject).toBeInstanceOf(MissionParams);
      expect(missionParamsObject).toEqual(missionParams);
    });
  });
});
