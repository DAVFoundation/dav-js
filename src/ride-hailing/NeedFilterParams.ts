import BaseNeedFilterParams from '../NeedFilterParams';

/**
 * @class The Class ride-hailing/NeedFilterParams represent the parameters that used to filter ride-hailing needs.
 */
export default class NeedFilterParams extends BaseNeedFilterParams {

    private static _protocol = 'ride_hailing';
    private static _type = 'need_filter';

    public static getMessageType(): string {
        return `${this._protocol}:${this._type}`;
    }

    public static deserialize(json: any): NeedFilterParams {
        const needFilterParams = super.deserialize(json);
        return new NeedFilterParams(needFilterParams);
    }

    constructor(values: Partial<NeedFilterParams>) {
        super(values, NeedFilterParams._protocol, NeedFilterParams._type);
        if (!values.location || !values.location.lat || !values.location.long || !values.radius) {
            throw new Error('NeedFilter lack of essential parameters');
        }
   }

    public serialize() {
       const formattedParams = super.serialize();
       return formattedParams;
   }
}
