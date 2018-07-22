import BaseBidParams from '../BidParams';

export default class BidParams extends BaseBidParams {
    public plugType: string;

    constructor(init: Partial<BidParams>) {
        super();
    }

    public toString(): string { return ''; }
}
