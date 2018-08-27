import BaseNeedFilterParams from '../NeedFilterParams';
import { IDimensions } from '../common-types';

/**
 * @class The Class boat-charging/NeedFilterParams represent the parameters that used to filter boat-charging needs.
 */
export default class NeedFilterParams extends BaseNeedFilterParams {
    private static _protocol = 'boat_charging';
    private static _type = 'need';
    public maxDimensions: IDimensions;

    public static getMessageType(): string {
        return 'boat_charging:need';
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
