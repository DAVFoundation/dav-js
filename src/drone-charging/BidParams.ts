import BaseBidParams from '../BidParams';
import Price from '../Price';
import { log } from 'handlebars';

export default class BidParams extends BaseBidParams {

    public plugType: string;

    public static fromJson(json: string) {
        const object = JSON.parse(json);
        const price =  new Price(object.price.value, object.price.type);
        if (object.description) {
            price.description = object.price.description;
        }
        const bidParams = new BidParams({price});
        if (object.ttl) {
            bidParams.ttl = object.ttl;
        }
        if (object.plugType) {
            bidParams.plugType = object.plugType;
        }
        return bidParams;
    }

    constructor(init: Partial<BidParams>) {
        super(init.id, init.price, init.vehicleId, init.needTypeId);
    }

    public toJson() {
        const bidParams = Object.assign({protocol: 'drone-charging', type: 'bid'}, this);
        return JSON.stringify(bidParams);
    }

    public toString(): string {
        return this.toJson();
    }

    public equals(other: BidParams): boolean {
        return this.ttl === other.ttl && this.price.equals(other.price) && this.plugType === other.plugType;
    }
}
