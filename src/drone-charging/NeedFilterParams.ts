import BaseNeedFilterParams from '../NeedFilterParams';

/**
 * @class The Class drone-charging/NeedFilterParams represent the parameters that used to filter drone-charging needs.
 */
export default class NeedFilterParams extends BaseNeedFilterParams {
    private static _protocol = 'drone_charging';
    private static _type = 'NeedFilter';

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
        return formatedParams;
    }
}
