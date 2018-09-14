import MissionParams from './MissionParams';

describe('MissionParams class', () => {

  const missionParams = new MissionParams({});
  missionParams.id = 'TOPIC_ID';
  missionParams.neederDavId = 'DavId';
  const serializedMissionParams: any = {
    id: 'TOPIC_ID',
    neederDavId: 'DavId',
    ttl: undefined,
    protocol: 'ride_hailing',
    type: 'mission',
    price: undefined,
    vehicleId: undefined,
  };

  describe('serialize method', () => {
    it('should return serialized need params object with the current values', () => {
      expect(missionParams.serialize()).toEqual(serializedMissionParams);
    });
  });

  describe('deserialize method', () => {
    it('should return NeedParams instance with the current parameters', () => {
      const missionParamsObject = new MissionParams();
      missionParamsObject.deserialize(serializedMissionParams);
      expect(missionParamsObject).toEqual(missionParams);
    });
  });
});
