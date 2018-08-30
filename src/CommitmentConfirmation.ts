import CommitmentConfirmationParams from './CommitmentConfirmationParams';

export default class CommitmentConfirmation {

    public get BidId() {
        return this._commitmentParams.bidId;
    }

    constructor(private _commitmentParams: CommitmentConfirmationParams) {

    }
}
