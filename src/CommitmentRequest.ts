import Kafka from './Kafka';
import IConfig from './IConfig';
import CommitmentRequestParams from './CommitmentRequestParams';
import CommitmentConfirmationParams from './CommitmentConfirmationParams';

export default class CommitmentRequest {
  constructor(
    private _bidId: string,
    private _commitmentRequestParams: CommitmentRequestParams,
    private _config: IConfig,
  ) {
    /** */
  }

  public async confirm() {
    const commitmentConfirmationParams: CommitmentConfirmationParams = new CommitmentConfirmationParams(
      { bidId: this._bidId },
    );
    await Kafka.sendParams(
      this._commitmentRequestParams.neederId,
      commitmentConfirmationParams,
      this._config,
    );
  }
}
