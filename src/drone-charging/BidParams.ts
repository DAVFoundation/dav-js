import BaseBidParams, { IBidParams } from '../BidParams';
import Price from '../Price';

export default class BidParams extends BaseBidParams {

    private static _protocol = 'DroneCharging';
    private static _type = 'Bid';

    public plugType: string;
    public static getMessageType(): string {
        return `${this._protocol}:${this._type}`;
    }

    public static fromJson(json: any): BidParams {
        const price = new Price(json.price.value, json.price.type);
        const vehicleId = json.vehicleId;
        if (json.description) {
            price.description = json.price.description;
        }
        const bidParams = new BidParams({ price, vehicleId });
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
        const bidParams = Object.assign({ protocol: BidParams._protocol, type: BidParams._type }, this);
        return JSON.stringify(bidParams);
    }

    public toString(): string {
        return this.toJson();
    }

    public equals(other: BidParams): boolean {
        return this.ttl === other.ttl && this.price.equals(other.price) && this.plugType === other.plugType;
    }
}
