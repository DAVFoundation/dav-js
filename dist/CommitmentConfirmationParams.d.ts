import BasicParams from './BasicParams';
import IBasicParams from './IBasicParams';
export interface ICommitmentConfirmationParams extends IBasicParams {
    bidId: string;
}
export default class CommitmentConfirmationParams extends BasicParams {
    static _protocol: string;
    static _messageType: string;
    bidId: string;
    static getMessageType(): string;
    static getMessageProtocol(): string;
    constructor(values?: Partial<ICommitmentConfirmationParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    getProtocolTypes(): any;
    deserialize(json: any): void;
}
//# sourceMappingURL=CommitmentConfirmationParams.d.ts.map