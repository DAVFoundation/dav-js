import IConfig from './IConfig';
import CommitmentRequestParams from './CommitmentRequestParams';
export default class CommitmentRequest {
    private _bidId;
    private _commitmentRequestParams;
    private _config;
    constructor(_bidId: string, _commitmentRequestParams: CommitmentRequestParams, _config: IConfig);
    confirm(): Promise<void>;
}
