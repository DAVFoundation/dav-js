import BaseBidParams from '../BidParams';
import IPrice from '../IPrice';
import Price from '../Price';
import { BigInteger, ID, DavID } from '../common-types';
import IBaseBidParams from '../IBidParams';

/**
 * @interface IBidParams The interface boat-charging/IBidParams represent a valid argument of boat-charging/BidParams constructor.
 */
interface IBidParams extends IBaseBidParams {
    /**
     * @property The bid's topic id (used to send messages to service provider).
     */
    id: ID;
    /**
     * @property The bid's price (required).
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
        });
        return new BidParams(bidParams);
    }

    constructor(values: Partial<IBidParams>) {
        super(values, BidParams._protocol, BidParams._type);
        Object.assign(this, values);
    }

    public serialize() {
        const formatedParams = super.serialize();
        Object.assign(formatedParams, {
            protocol: BidParams._protocol,
            type: BidParams._type,
        });
        return formatedParams;
    }
    public equals(other: BidParams): boolean {
        return super.equals(other);
    }
}
