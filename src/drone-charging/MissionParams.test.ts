import MissionParams from './MissionParams';

describe('MissionParams class', () => {
  let missionParams: MissionParams;
  let serializedMissionParams: any;

  beforeEach(() => {
    missionParams = new MissionParams({
      id: 'TOPIC_ID',
      price: ['11111111'],
      vehicleId: 'PROVIDER_DAV_ID',
      neederDavId: 'CONSUMER_DAV_ID',
    });

    serializedMissionParams = {
      protocol: 'drone_charging',
      type: 'mission',
      id: 'TOPIC_ID',
      price: ['11111111'],
      vehicleId: 'PROVIDER_DAV_ID',
      neederDavId: 'CONSUMER_DAV_ID',
    };
  });

  describe('serialize method', () => {
    it('should return serialized MissionParams object with the current values', () => {
      expect(missionParams.serialize()).toEqual(serializedMissionParams);
    });
  });

  describe('deserialize method', () => {
    it('should return a MissionParams instance', () => {
      const missionParamsObject = new MissionParams();
      missionParamsObject.deserialize(serializedMissionParams);
      expect(missionParamsObject).toBeInstanceOf(MissionParams);
    });

    it('should return a correct MissionParams object', () => {
      const missionParamsObject = new MissionParams({});
      missionParamsObject.deserialize(serializedMissionParams);
      expect(missionParamsObject).toEqual(missionParams);
    });
  });
});
