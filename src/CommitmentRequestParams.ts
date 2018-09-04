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

    constructor(values?: Partial<ICommitmentRequestParams>) {
        super(CommitmentRequestParams._protocol, CommitmentRequestParams._type, values);
        if (!!values) {
            this.neederId = values.neederId;
        }
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            neederId: this.neederId,
        });
        return formattedParams;
    }

    public getProtocolTypes() {
        const typeMap: any = {};
        typeMap[CommitmentRequestParams._type] = CommitmentRequestParams;
        typeMap.messages = [CommitmentRequestParams._type];
        return typeMap;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
        this.neederId = json.neederId;
    }
}
