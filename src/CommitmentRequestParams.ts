import BasicParams from './BasicParams';

export interface ICommitmentRequestParams extends BasicParams {
  neederId: string;
}

export default class CommitmentRequestParams extends BasicParams {
  public static _protocol = '';
  public static _messageType = 'commitment_request';

  public neederId: string;

  constructor(values?: Partial<ICommitmentRequestParams>) {
    super(
      CommitmentRequestParams._protocol,
      CommitmentRequestParams._messageType,
      values,
    );

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

  public deserialize(json: any): void {
    super.deserialize(json);
    this.neederId = json.neederId;
  }
}
