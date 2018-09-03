import BasicParams from './BasicParams';
import IBasicParams from './IBasicParams';

export interface ICommitmentRequestParams extends BasicParams {
    neederId: string;
}

export default class CommitmentRequestParams extends BasicParams {

    public static _protocol = 'general';
    public static _type = 'commitment-request';

    public neederId: string;

    public static getMessageType(): string {
        return CommitmentRequestParams._type;
    }

    public static getMessageProtocol(): string {
        return CommitmentRequestParams._protocol;
    }

    public static deserialize(json: any): CommitmentRequestParams {
        const commitmentRequestParams = super.deserialize(json);
        Object.assign(commitmentRequestParams, {
            neederId: json.neederId,
        });
        return new CommitmentRequestParams(commitmentRequestParams);
    }

    constructor(values: Partial<ICommitmentRequestParams>) {
        super(values, CommitmentRequestParams._protocol, CommitmentRequestParams._type);
        this.neederId = values.neederId;
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            neederId: this.neederId,
        });
        return formattedParams;
    }

    public getProtocolTypes() {
        throw new Error('there is no protocol for general messages');
    }
}
