import BaseNeedParams from '../NeedParams';
import ProtocolTypes from './ProtocolTypes';

/**
 * @class The Class drone-charging/NeedParams represent the parameters of drone-charging need.
 */
export default class NeedParams extends BaseNeedParams {

    private static _protocol = 'drone_charging';
    private static _type = 'need';

    public static getMessageType(): string {
        return NeedParams._protocol;
    }

    public static getMessageProtocol(): string {
        return NeedParams._type;
    }

    public static deserialize(json: any): NeedParams {
        const needParams = super.deserialize(json);
        return new NeedParams(needParams);
    }

    constructor(values: Partial<BaseNeedParams>) {
        super(values, NeedParams._protocol, NeedParams._type);
    }

    public serialize() {
        const formatedParams = super.serialize();
        return formatedParams;
    }

    public getProtocolTypes() {
        return ProtocolTypes;
    }

}
