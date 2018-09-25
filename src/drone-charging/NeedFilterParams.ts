import BaseNeedFilterParams from '../NeedFilterParams';

/**
 * @class The Class drone-charging/NeedFilterParams represent the parameters that used to filter drone-charging needs.
 */
export default class NeedFilterParams extends BaseNeedFilterParams {
    private static _protocol = 'drone_charging';
    private static _type = 'need_filter';

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
        return formattedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
    }
}
