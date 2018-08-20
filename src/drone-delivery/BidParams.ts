import BaseBidParams from '../BidParams';
import { ID, BigInteger, DavID } from '../common-types';
import IPrice from '../IPrice';

/**
 * @interface IBidParams The interface drone-delivery/IBidParams represent a valid argument of drone-delivery/BidParams constructor.
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
    /**
     * @property Time from contract signing to delivery in seconds.
     */
    name: string;
    /**
     * @property The drone name.
     */
    eta: number;
}
/**
 * @class The Class drone-delivery/BidParams represent the parameters of drone-delivery bid.
 */
export default class BidParams extends BaseBidParams {
    /**
     * @property The drone name.
     */
    public name?: string;
    /**
     * @property Time from contract signing to delivery in seconds.
     */
    public eta?: number; // Time from contract signing to delivery in seconds

    public static getMessageType(): string {
        return 'DroneDelivery:Bid';
    }

    public static fromJson(json: any): BidParams {
        const bidParams = new BidParams(json);
        Object.assign(bidParams, json);
        return bidParams;
    }

    constructor(values: Partial<IBidParams>) {
        super(values);
        Object.assign(this, values);
    }

    public toJson(): string {
        throw new Error('Method not implemented.');
    }
}
