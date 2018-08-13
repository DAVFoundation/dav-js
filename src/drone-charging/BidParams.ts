import BaseBidParams, { IBidParams } from '../BidParams';
import Price from '../Price';

export default class BidParams extends BaseBidParams {

    public plugType: string;
    public static getMessageType(): string {
        return 'DroneCharging:Bid';
    }

    public static fromJson(json: any): BidParams {
        const price = new Price(json.price.value, json.price.type);
        if (json.description) {
            price.description = json.price.description;
        }
        const bidParams = new BidParams({ price });
        if (json.ttl) {
            bidParams.ttl = json.ttl;
        }
        if (json.plugType) {
            bidParams.plugType = json.plugType;
        }
        return bidParams;
    }

    constructor(values: Partial<IBidParams>) {
        super(values);
    }

    public toJson() {
        const bidParams = Object.assign({ protocol: 'drone-charging', type: 'bid' }, this);
        return JSON.stringify(bidParams);
    }

    public toString(): string {
        return this.toJson();
    }

    public equals(other: BidParams): boolean {
        return this.ttl === other.ttl && this.price.equals(other.price) && this.plugType === other.plugType;
    }
}
