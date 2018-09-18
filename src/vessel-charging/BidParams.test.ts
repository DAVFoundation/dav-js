import BidParams from './BidParams';
import { EnergySources, Amenities } from './enums';

describe('BidParams class', () => {

    const bidParams = new BidParams({
        // entranceLocation:,
        // exitLocation:,
        // availableFrom,:
        // availableUntil,:
        // energySource:,
        // amenities:,
        // provider:,
        // manufactu,rer:
        // model:,
    });
    
    describe('serialize method', () => {
        it('should return serialized bid params object with the current values', () => {
            // expect(bidParams.serialize()).toEqual();
        });
    });

});