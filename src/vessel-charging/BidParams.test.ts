import BidParams from './BidParams';
import { EnergySources, Amenities } from './enums';

describe('BidParams class', () => {
    const bidParams = new BidParams({
        price: '100000000000000000',
        vehicleId: '34',
        entranceLocation: {
          lat: 32.050382,
          long: 34.766149,
        },
        exitLocation: {
          lat: 32.050382,
          long: 34.766149,
        },
        availableFrom: 1535441613658,
        availableUntil: 1535441623658,
        energySource: EnergySources.hydro,
        amenities: [Amenities.Park],
        provider: 'N3m0',
        isCommitted: true,
        manufacturer: 'manufacturer_name',
        model: 'model_name',
      });
    bidParams.id = 'bidSource';
    bidParams.neederDavId = 'davId';
    const serializedBidParams: any = {
        ttl: undefined,
        protocol: 'boat_charging',
        type: 'bid',
        id: 'bidSource',
        price: ['100000000000000000'],
        vehicleId: '34',
        entranceLocation: {
          lat: 32.050382,
          long: 34.766149,
        },
        exitLocation: {
          lat: 32.050382,
          long: 34.766149,
        },
        availableFrom: 1535441613658,
        availableUntil: 1535441623658,
        energySource: 'hydro',
        amenities: [5],
        provider: [5],
        isCommitted: true,
        manufacturer: [5],
        model: [5],
        neederDavId: 'davId',
      };

    describe('serialize method', () => {
        it('should return serialized bid params object with the current values', () => {
            expect(bidParams.serialize()).toEqual(serializedBidParams);
        });
    });
    describe('deserialize method', () => {
        it('should return BidParams instance with the current parameters', () => {
            const bidParamsObject = new BidParams();
            bidParamsObject.deserialize(serializedBidParams);
            expect(bidParamsObject).not.toBe(bidParams);
        });
    });
});
