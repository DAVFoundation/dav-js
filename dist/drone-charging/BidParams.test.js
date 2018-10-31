"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BidParams_1 = require("./BidParams");
describe('BidParams class', () => {
    let bidParams;
    let serializedBidParams;
    beforeEach(() => {
        bidParams = new BidParams_1.default({
            id: 'TOPIC_ID',
            price: ['66666666'],
            vehicleId: 'VEHICLE_DAV_ID',
            neederDavId: 'CONSUMER_DAV_ID',
            isCommitted: true,
            plugType: undefined,
        });
        serializedBidParams = {
            ttl: undefined,
            protocol: 'drone_charging',
            type: 'bid',
            id: 'TOPIC_ID',
            price: ['66666666'],
            vehicleId: 'VEHICLE_DAV_ID',
            neederDavId: 'CONSUMER_DAV_ID',
            isCommitted: true,
            plugType: undefined,
        };
    });
    describe('serialize method', () => {
        it('should return serialized BidParams object with the current values', () => {
            expect(bidParams.serialize()).toEqual(serializedBidParams);
        });
    });
    describe('deserialize method', () => {
        it('should return deserialize BidParams instance with the current parameters', () => {
            const bidParamsObject = new BidParams_1.default();
            bidParamsObject.deserialize(serializedBidParams);
            expect(bidParamsObject).toEqual(bidParams);
        });
    });
});

//# sourceMappingURL=BidParams.test.js.map
