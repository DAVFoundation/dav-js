import BaseMessageParams from '../MessageParams';
/**
 * @class The Class drone-charging/MessageParams represent the parameters of drone-charging provider status message.
 */
export default class MessageParams extends BaseMessageParams {
  public static _messageType = 'provider_status_message';
  public finishEta: number;

  constructor(values?: Partial<MessageParams>) {
    super(MessageParams._messageType, values);
    if (!!values) {
      if (!values.finishEta) {
        throw new Error('finishEta is a required field');
      }
      this.finishEta = values.finishEta;
    }
  }

  public serialize() {
    const formattedParams = super.serialize();
    Object.assign(formattedParams, {
      finishEta: this.finishEta,
    });
    return formattedParams;
  }

  public deserialize(json: any): void {
    super.deserialize(json);
    this.finishEta = json.finishEta;
  }
}
