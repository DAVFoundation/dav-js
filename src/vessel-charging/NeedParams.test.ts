import NeedParams from './NeedParams';
import { EnergySources, Amenities } from './enums';

describe('NeedParams class', () => {
    const needParams = new NeedParams({
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
        energySource: EnergySources.hydro,
        amenities: [Amenities.Park],
    });
    needParams.id = 'TOPIC_ID';
    needParams.davId = 'davId';
    const serializedNeedParams: any = {
        ttl: undefined,
        protocol: 'boat_charging',
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
        amenities: [1],
    };

    describe('serialize method', () => {
        it('should return serialized need params object with the current values', () => {
            expect(needParams.serialize()).toEqual(serializedNeedParams);
        });
    });

    describe('deserialize method', () => {
        it('should return NeedParams instance with the current parameters', () => {
            expect(NeedParams.deserialize(serializedNeedParams)).toEqual(needParams);
        });
    });

});
