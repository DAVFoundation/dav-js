import BasicParams from './BasicParams';
import IBasicParams from './IBasicParams';

export interface ICommitmentConfirmationParams extends IBasicParams {
  bidId: string;
}

export default class CommitmentConfirmationParams extends BasicParams {
  public static _protocol = '';
  public static _messageType = 'commitment_confirmation';
  public bidId: string;

  public static getMessageType(): string {
    return CommitmentConfirmationParams._messageType;
  }

  public static getMessageProtocol(): string {
    return CommitmentConfirmationParams._protocol;
  }

  constructor(values?: Partial<ICommitmentConfirmationParams>) {
    super(
      CommitmentConfirmationParams._protocol,
      CommitmentConfirmationParams._messageType,
      values,
    );
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

  public getProtocolTypes() {
    const typeMap: any = {};
    typeMap[
      CommitmentConfirmationParams._messageType
    ] = CommitmentConfirmationParams;
    typeMap.messages = [CommitmentConfirmationParams._messageType];
    return typeMap;
  }

  public deserialize(json: any): void {
    super.deserialize(json);
    this.bidId = json.bidId;
  }
}
