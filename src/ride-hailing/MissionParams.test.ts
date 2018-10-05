import MissionParams from './MissionParams';

describe('MissionParams class', () => {
  let missionParams: MissionParams;
  let serializedMissionParams: any;

  beforeEach(() => {
    missionParams = new MissionParams({});

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
  	//testing for instance
    it('should return serialized MissionParams instance with the current parameters', () => {
      const missionParamsObject = new MissionParams();
      missionParamsObject.deserialize(serializedMissionParams);
      expect(missionParamsObject).toBeInstanceOf(MissionParams);
    });
    //testing for object content
    it('should return serialized MissionParams object with the current parameters', () => {
      const missionParamsObject = new MissionParams();
      missionParamsObject.deserialize(serializedMissionParams);
      expect(missionParamsObject).toEqual(missionParams);
    });
  });
});
