import BidParams from './BidParams';

describe('BidParams class', () => {
    let bidParams: BidParams;
    let serializedBidParams: any;

    beforeEach(() => {
        bidParams = new BidParams({
            id: 'TOPIC_ID',
            price: ['50000'],
            vehicleId: 'VEHICLE_DAV_ID',
            neederDavId: 'CONSUMER_DAV_ID',
            isCommitted: true,
            eta: undefined,
        });

        serializedBidParams = {
            id: 'TOPIC_ID',
            price: ['50000'],
            vehicleId: 'VEHICLE_DAV_ID',
            neederDavId: 'CONSUMER_DAV_ID',
            isCommitted: true,
            eta: undefined,
            protocol: 'drone_delivery',
            type: 'bid',
        };
    });

    describe('serialize method', () => {
        it('should return serialized BidParams object with the current values', () => {
            expect(bidParams.serialize()).toEqual(serializedBidParams);
        });
    });

    describe('deserialize method', () => {
        it('should return a BidParams instance', () => {
            const bidParamsObject = new BidParams({
                eta: undefined,
                price: ['50000'],
                vehicleId: 'VEHICLE_DAV_ID',
            });
            bidParamsObject.deserialize(serializedBidParams);
            expect(bidParamsObject).toBeInstanceOf(BidParams);
        });

        it('should return serialized BidParams instance with the current parameters', () => {
            const bidParamsObject = new BidParams({
                eta: undefined,
                price: ['50000'],
                vehicleId: 'VEHICLE_DAV_ID',
              });
            bidParamsObject.deserialize(serializedBidParams);
            expect(bidParamsObject).toEqual(bidParams);
        });
    });
});
