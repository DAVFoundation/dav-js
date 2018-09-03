import BaseNeedFilterParams from '../NeedFilterParams';
import ProtocolTypes from './ProtocolTypes';

/**
 * @class The Class drone-charging/NeedFilterParams represent the parameters that used to filter drone-charging needs.
 */
export default class NeedFilterParams extends BaseNeedFilterParams {
    private static _protocol = 'drone_charging';
    private static _type = 'need_filter';

    public static getMessageType(): string {
        return NeedFilterParams._protocol;
    }

    public static getMessageProtocol(): string {
        return NeedFilterParams._type;
    }

    public static deserialize(json: any): NeedFilterParams {
        const needFilterParams = super.deserialize(json);
        return new NeedFilterParams(needFilterParams);
    }

    constructor(values: Partial<NeedFilterParams>) {
        super(values, NeedFilterParams._protocol, NeedFilterParams._type);
    }

    public serialize() {
        const formatedParams = super.serialize();
        return formatedParams;
    }

    public getProtocolTypes() {
        return ProtocolTypes;
    }
}
