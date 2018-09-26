import BaseNeedFilterParams from '../NeedFilterParams';
import { IDimensions } from '../common-types';

/**
 * @class The Class vessel-charging/NeedFilterParams represent the parameters that used to filter vessel-charging needs.
 */
export default class NeedFilterParams extends BaseNeedFilterParams {
    public static _protocol = 'vessel_charging';
    public static _messageType = 'need_filter';

    public maxDimensions: IDimensions;

    constructor(values?: Partial<NeedFilterParams>) {
        super(NeedFilterParams._protocol, NeedFilterParams._messageType, values);
        if (!!values) {
            this.maxDimensions = values.maxDimensions;
        }
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {dimensions: this.maxDimensions});
        return formattedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
        this.maxDimensions = json.dimensions;
    }
}
