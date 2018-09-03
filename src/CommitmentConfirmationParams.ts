import BasicParams from './BasicParams';
import IBasicParams from './IBasicParams';

export interface ICommitmentConfirmationParams extends IBasicParams {
    bidId: string;
}

export default class CommitmentConfirmationParams extends BasicParams {

    private static _protocol = 'general';
    private static _type = 'commitment-confirmation';

    public bidId: string;

    public static getMessageType() {
        return `${CommitmentConfirmationParams._protocol}:${CommitmentConfirmationParams._type}`;
    }

    constructor(values?: Partial<ICommitmentConfirmationParams>) {
        super(CommitmentConfirmationParams._protocol, CommitmentConfirmationParams._type, values);
        if (!!values) {
            this.bidId = values.bidId;
        }
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            bidId: this.bidId,
            isConfirmed: true,
        });
        return formattedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
        this.bidId = json.bidId;
    }
}
