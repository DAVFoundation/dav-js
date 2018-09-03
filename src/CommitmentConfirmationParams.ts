import BasicParams from './BasicParams';
import IBasicParams from './IBasicParams';

export interface ICommitmentConfirmationParams extends IBasicParams {
    bidId: string;
}

export default class CommitmentConfirmationParams extends BasicParams {

    private static _protocol = 'general';
    private static _type = 'commitment-confirmation';

    public bidId: string;


    public static getMessageType(): string {
        return CommitmentConfirmationParams._protocol;
    }

    public static getMessageProtocol(): string {
        return CommitmentConfirmationParams._type;
    }

    public static deserialize(json: any): CommitmentConfirmationParams {
        const commitmentConfirmationParams = super.deserialize(json);
        Object.assign(commitmentConfirmationParams, {
            bidId: json.bidId,
        });
        return new CommitmentConfirmationParams(commitmentConfirmationParams);
    }

    constructor(values: Partial<ICommitmentConfirmationParams>) {
        super(values, CommitmentConfirmationParams._protocol, CommitmentConfirmationParams._type);
        this.bidId = values.bidId;
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            bidId: this.bidId,
            isConfirmed: true,
        });
        return formattedParams;
    }

    public getProtocolTypes() {
        throw new Error('there is no protocol for general messages');
    }
}
