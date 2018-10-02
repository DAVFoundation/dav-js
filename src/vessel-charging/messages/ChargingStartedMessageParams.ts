import BaseMessageParams from '../MessageParams';
/**
 * @class The Class vessel-charging/ChargingStartedMessageParams represent the parameters of provider notifying that charging has begun.
 */
export default class MessageParams extends BaseMessageParams {
  public static _messageType = 'charging_started_message';

  constructor(values?: Partial<MessageParams>) {
    super(MessageParams._messageType, values);
  }

  public serialize() {
    const formattedParams = super.serialize();
    return formattedParams;
  }

  public deserialize(json: any): void {
    const messageParams = super.deserialize(json);
  }
}
