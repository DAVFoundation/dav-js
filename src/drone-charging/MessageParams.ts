import BaseMessageParams from '../MessageParams';

/**
 * @class The Class drone-charging/MessageParams represent the parameters of drone-charging message.
 */
export default abstract class MessageParams extends BaseMessageParams {
  public static _protocol = 'drone_charging';

  constructor(messageType: string, values?: Partial<MessageParams>) {
    super(MessageParams._protocol, messageType, values);
  }

  public serialize() {
    const formattedParams = super.serialize();
    return formattedParams;
  }

  public deserialize(json: any): void {
    super.deserialize(json);
  }
}
