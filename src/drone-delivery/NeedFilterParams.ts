import BaseNeedFilterParams from '../NeedFilterParams';
import { IDimensions } from '../common-types';

/**
 * @class The Class drone-delivery/NeedFilterParams represent the parameters that used to filter drone-delivery needs.
 */
export default class NeedFilterParams extends BaseNeedFilterParams {
    private static _protocol = 'DroneDelivery';
    private static _type = 'NeedFilter';
    public maxDimensions: IDimensions;

    public static getMessageType(): string {
        return `${NeedFilterParams._protocol}:${NeedFilterParams._type}`;
    }

    public static deserialize(json: any) {
        const needFilterParams = super.deserialize(json);
        return new NeedFilterParams(needFilterParams);
    }

    constructor(values: Partial<NeedFilterParams>) {
        super(values, NeedFilterParams._protocol, NeedFilterParams._type);
    }

    public serialize() {
        const formatedParams = super.serialize();
        formatedParams.protocol = NeedFilterParams._protocol;
        formatedParams.type = NeedFilterParams._type;
        formatedParams.dimensions = this.maxDimensions;
        return formatedParams;
    }
}
