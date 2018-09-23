import BasicParams from './BasicParams';
export interface ICommitmentRequestParams extends BasicParams {
    neederId: string;
}
export default class CommitmentRequestParams extends BasicParams {
    static _protocol: string;
    static _type: string;
    neederId: string;
    static getMessageType(): string;
    static getMessageProtocol(): string;
    constructor(values?: Partial<ICommitmentRequestParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    getProtocolTypes(): any;
    deserialize(json: any): void;
}
//# sourceMappingURL=CommitmentRequestParams.d.ts.map