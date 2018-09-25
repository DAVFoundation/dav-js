import BaseNeedFilterParams from '../NeedFilterParams';

/**
 * @class The Class ride-hailing/NeedFilterParams represent the parameters that used to filter ride-hailing needs.
 */
export default class NeedFilterParams extends BaseNeedFilterParams {

    public static _protocol = 'ride_hailing';
    public static _messageType = 'need_filter';

    constructor(values?: Partial<NeedFilterParams>) {
        super(NeedFilterParams._protocol, NeedFilterParams._messageType, values);
        if (!!values) {
            if (!values.location || !values.location.lat || !values.location.long || !values.radius) {
                throw new Error('NeedFilter lack of essential parameters');
            }
        }
    }

    public serialize() {
       const formattedParams = super.serialize();
       return formattedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
    }
}
