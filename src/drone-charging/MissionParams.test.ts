import MissionParams from './MissionParams';

describe('MissionParams class', () => {
  let missionParams: MissionParams;
  let serializedMissionParams: any;

  beforeEach(() => {
    missionParams = new MissionParams({});

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
      const missionParamsObject = new MissionParams();
      missionParamsObject.deserialize(serializedMissionParams);
      expect(missionParamsObject).toBeInstanceOf(MissionParams);
    });

    it('should return the correct deserialized parameters', () => {
      const missionParamsObject = new MissionParams();
      missionParamsObject.deserialize(serializedMissionParams);
      expect(missionParamsObject).toEqual(missionParams);
    });
  });
});
