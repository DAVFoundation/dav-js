"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NeedFilterParams_1 = require("./NeedFilterParams");
describe('NeedFilterParams class', () => {
    let needFilterParams;
    let serializedNeedFilterParams;
    beforeEach(() => {
        needFilterParams = new NeedFilterParams_1.default({
            location: {
                lat: 32.050382,
                long: 34.766149,
            },
            radius: 2000,
        });
        serializedNeedFilterParams = {
            area: {
                max: {
                    latitude: parseFloat((32.06836666390769).toFixed(6)),
                    longitude: parseFloat((34.78737405278662).toFixed(6)),
                },
                min: {
                    latitude: parseFloat((32.03239380095659).toFixed(6)),
                    longitude: parseFloat((34.74493228891106).toFixed(6)),
                },
            },
            davId: undefined,
            dimensions: undefined,
            protocol: 'drone_delivery',
            type: 'need_filter',
            ttl: undefined,
        };
    });
    describe('serialize method', () => {
        it('should return serialized NeedFilterParams object with the current values', () => {
            expect(needFilterParams.serialize()).toEqual(serializedNeedFilterParams);
        });
    });
    describe('deserialize method', () => {
        it('should return a NeedFilterParams instance', () => {
            const needFilterParamsObject = new NeedFilterParams_1.default();
            needFilterParamsObject.deserialize(serializedNeedFilterParams);
            expect(needFilterParamsObject).toBeInstanceOf(NeedFilterParams_1.default);
        });
        it('should return deserialize NeedFilterParams instance with current parameters', () => {
            const needFilterParamsObject = new NeedFilterParams_1.default();
            needFilterParamsObject.deserialize(serializedNeedFilterParams);
            expect(needFilterParamsObject).toEqual(needFilterParams);
        });
    });
});

//# sourceMappingURL=NeedFilterParams.test.js.map
