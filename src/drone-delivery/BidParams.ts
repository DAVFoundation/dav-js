import BaseBidParams from '../BidParams';
import IBaseBidParams from '../IBidParams';

/**
 * @interface IBidParams The interface drone-delivery/IBidParams represent a valid argument of drone-delivery/BidParams constructor.
 */
interface IBidParams extends IBaseBidParams {
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
     * @property Time from contract signing to delivery in seconds.
     */
    public eta?: number; // Time from contract signing to delivery in seconds

    public static getMessageType(): string {
        return `${BidParams._protocol}:${BidParams._type}`;
    }

    public static deserialize(json: any): BidParams {
        const bidParams = super.deserialize(json);
        Object.assign(bidParams, {
            eta: json.eta,
        });
        return new BidParams(bidParams);
    }

    constructor(values: Partial<IBidParams>) {
        super(values, BidParams._protocol, BidParams._type);
        this.eta = values.eta;
    }

    public serialize() {
        const formatedParams = super.serialize();
        Object.assign(formatedParams, {
            eta: this.eta,
        });
        return formatedParams;
    }

    public equals(other: BidParams): boolean {
        return super.equals(other) && this.eta === other.eta;
    }
}
