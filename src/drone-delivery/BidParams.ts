import BaseBidParams from '../BidParams';
import IBaseBidParams from '../IBidParams';

/**
 * @interface IBidParams The interface drone-delivery/IBidParams represent a valid argument of drone-delivery/BidParams constructor.
 */
interface IBidParams extends IBaseBidParams {
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
    private static _protocol = 'DroneDelivery';
    private static _type = 'Bid';

    /**
     * @property The drone name.
     */
    public name?: string;
    /**
     * @property Time from contract signing to delivery in seconds.
     */
    public eta?: number; // Time from contract signing to delivery in seconds

    public static getMessageType(): string {
        return `${BidParams._protocol}:${BidParams._type}`;
    }

    public static fromJson(json: any): BidParams {
        return new BidParams(json);
    }

    constructor(values: Partial<IBidParams>) {
        super(values, BidParams._protocol, BidParams._type);
        this.name = values.name;
        this.eta = values.eta;
    }
}
