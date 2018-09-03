import BaseNeedFilterParams from '../NeedFilterParams';
import { IDimensions } from '../common-types';
import ProtocolTypes from './ProtocolTypes';

/**
 * @class The Class drone-delivery/NeedFilterParams represent the parameters that used to filter drone-delivery needs.
 */
export default class NeedFilterParams extends BaseNeedFilterParams {
    private static _protocol = 'drone_delivery';
    private static _type = 'need_filter';
    public maxDimensions: IDimensions;

    public static getMessageType(): string {
        return NeedFilterParams._type;
    }

    public static getMessageProtocol(): string {
        return NeedFilterParams._protocol;
    }

    constructor(values?: Partial<NeedFilterParams>) {
        super(NeedFilterParams._protocol, NeedFilterParams._type, values);
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {dimensions: this.maxDimensions});
        return formattedParams;
    }

    public getProtocolTypes() {
        return ProtocolTypes;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
        this.maxDimensions = json.dimensions;
    }
}
