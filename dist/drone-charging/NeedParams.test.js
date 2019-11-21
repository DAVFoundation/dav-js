"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NeedParams_1 = require("./NeedParams");
describe('NeedParams class', () => {
    let needParams;
    let serializedNeedParams;
    beforeEach(() => {
        needParams = new NeedParams_1.default({
            davId: undefined,
            location: {
                lat: undefined,
                long: undefined,
            },
        });
        serializedNeedParams = {
            ttl: undefined,
            protocol: 'drone_charging',
            type: 'need',
            location: {
                lat: undefined,
                long: undefined,
            },
            davId: undefined,
            id: undefined,
        };
    });
    describe('serialize method', () => {
        it('should return serialized NeedParams object with the current values', () => {
            expect(needParams.serialize()).toEqual(serializedNeedParams);
        });
    });
    describe('deserialize method', () => {
        it('should return a NeedParams instance', () => {
            const needParamsObject = new NeedParams_1.default();
            needParamsObject.deserialize(serializedNeedParams);
            expect(needParamsObject).toBeInstanceOf(NeedParams_1.default);
        });
        it('should return deserialize NeedParams instance with the current parameters', () => {
            const needParamsObject = new NeedParams_1.default();
            needParamsObject.deserialize(serializedNeedParams);
            expect(needParamsObject).toEqual(needParams);
        });
    });
});

//# sourceMappingURL=NeedParams.test.js.map
