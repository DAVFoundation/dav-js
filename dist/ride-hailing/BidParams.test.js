"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BidParams_1 = require("./BidParams");
describe('BidParams class', () => {
    let bidParams;
    let serializedBidParams;
    beforeEach(() => {
        bidParams = new BidParams_1.default({
            id: 'TOPIC_ID',
            price: '66666666',
            vehicleId: 'VEHICLE_DAV_ID',
            neederDavId: 'CONSUMER_DAV_ID',
            isCommitted: true,
            currentVehicleLocation: {
                lat: 55.755825,
                long: 37.617298,
            },
            vehicle: {
                type: 'car',
                manufacturer: 'Tesla',
                model: 's p100d',
                color: 'grey',
                licensePlate: 'LICENSE_PLATE',
            },
            driverName: 'Michael',
        });
        serializedBidParams = {
            ttl: undefined,
            protocol: 'ride_hailing',
            type: 'bid',
            id: 'TOPIC_ID',
            price: ['66666666'],
            vehicleId: 'VEHICLE_DAV_ID',
            neederDavId: 'CONSUMER_DAV_ID',
            isCommitted: true,
            currentVehicleLocation: {
                lat: 55.755825,
                long: 37.617298,
            },
            vehicle: {
                type: 'car',
                manufacturer: 'Tesla',
                model: 's p100d',
                color: 'grey',
                licensePlate: 'LICENSE_PLATE',
            },
            driverName: 'Michael',
        };
    });
    describe('serialize method', () => {
        it('should return serialized BidParams object with the current values', () => {
            expect(bidParams.serialize()).toEqual(serializedBidParams);
        });
    });
    describe('deserialize method', () => {
        it('should return serialized BidParams instance with the current parameters', () => {
            const bidParamsObject = new BidParams_1.default();
            bidParamsObject.deserialize(serializedBidParams);
            expect(bidParamsObject).toEqual(bidParams);
        });
    });
});

//# sourceMappingURL=BidParams.test.js.map
