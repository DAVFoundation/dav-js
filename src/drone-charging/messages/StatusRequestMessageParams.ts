import BaseMessageParams from '../MessageParams';
/**
 * @class The Class drone-charging/StatusRequestMessageParams represent the parameters of drone-charging status request message.
 */
export default class MessageParams extends BaseMessageParams {
  public static _messageType = 'status_request_message';

  constructor(values?: Partial<MessageParams>) {
    super(MessageParams._messageType, values);
  }

  public serialize() {
    const formattedParams = super.serialize();
    return formattedParams;
  }

  public deserialize(json: any): void {
    super.deserialize(json);
  }
}
