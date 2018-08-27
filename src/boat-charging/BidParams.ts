import BaseBidParams from '../BidParams';
import IPrice from '../IPrice';
import Price from '../Price';
import { BigInteger, ID, DavID } from '../common-types';

/**
 * @interface IBidParams The interface boat-charging/IBidParams represent a valid argument of boat-charging/BidParams constructor.
 */
interface IBidParams {
    /**
     * @property The bid's topic id (used to send messages to service provider).
     */
    id: ID;
    /**
     * @property The bid's price (required).
     */
    price: IPrice | BigInteger;
    /**
     * @property The bid's vehicle DAV Id (required).
     */
    vehicleId: DavID;
}
/**
 * @class The Class boat-charging/BidParams represent the parameters of boat-charging bid.
 */
export default class BidParams extends BaseBidParams {

    private static _protocol = 'BoatCharging';
    private static _type = 'Bid';

    public static getMessageType(): string {
        return `${this._protocol}:${this._type}`;
    }

    public static deserialize(json: any) {
        const bidParams = super.deserialize(json);
        Object.assign(bidParams, {
            plugType: json.plugType,
        });
        return bidParams;
    }

    constructor(values: Partial<IBidParams>) {
        super(values, BidParams._protocol, BidParams._type);
        Object.assign(this, values);
    }

    public serialize() {
        const formatedParams = super.serialize();
        Object.assign(formatedParams, {
        });
        return formatedParams;
    }

    public equals(other: BidParams): boolean {
        return super.equals(other);
    }
}
