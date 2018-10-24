import MissionParams from './MissionParams'

describe('MissionParams class', () => {
  let missionParams: MissionParams;
  let serializedMissionParams: any;

  beforeEach(() => {
    missionParams = new MissionParams({
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
      const missionParamsObject = new MissionParams();
      missionParamsObject.deserialize(serializedMissionParams);
      expect(missionParamsObject).toBeInstanceOf(MissionParams);
    });

    it('should return deserialize MissionParams instance with current parameters', () => {
      const missionParamsObject = new MissionParams();
      missionParamsObject.deserialize(serializedMissionParams);
      expect(missionParamsObject).toEqual(missionParams);
    });
  });
});
