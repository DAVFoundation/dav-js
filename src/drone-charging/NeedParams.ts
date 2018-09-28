import BaseNeedParams from '../NeedParams';

/**
 * @class The Class drone-charging/NeedParams represent the parameters of drone-charging need.
 */
export default class NeedParams extends BaseNeedParams {
  private static _protocol = 'drone_charging';
  private static _type = 'need';

  public static getMessageType(): string {
    return NeedParams._type;
  }

  public static getMessageProtocol(): string {
    return NeedParams._protocol;
  }

  constructor(values?: Partial<BaseNeedParams>) {
    super(NeedParams._protocol, NeedParams._type, values);
  }

  public serialize() {
    const formattedParams = super.serialize();
    return formattedParams;
  }

  public deserialize(json: any): void {
    super.deserialize(json);
  }
}
