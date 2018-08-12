import BaseBidParams from '../BidParams';

export default class BidParams extends BaseBidParams {
    public name?: string;
    public eta?: number; // Time from contract signing to delivery in seconds

    public static getMessageType(): string {
        return 'DroneDelivery:Bid';
    }

    public static fromJson(json: any): BidParams {
        const bidParams = new BidParams(json);
        Object.assign(bidParams, json);
        return bidParams;
    }

    constructor(init: Partial<BidParams>) {
        super(init.id, init.price, init.vehicleId, init.needTypeId);
    }

    public toJson(): string {
        throw new Error('Method not implemented.');
    }
}
