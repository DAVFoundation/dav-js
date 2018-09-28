import BaseMissionParams from '../MissionParams';
import IMissionParams from '../IMissionParams';

/**
 * @class The Class drone-charging/MissionParams represent the parameters of drone-charging mission.
 */
export default class MissionParams extends BaseMissionParams {
  private static _protocol = 'drone_charging';
  private static _type = 'mission';

  public static getMessageType(): string {
    return MissionParams._type;
  }

  public static getMessageProtocol(): string {
    return MissionParams._protocol;
  }

  constructor(values?: Partial<IMissionParams>) {
    super(MissionParams._protocol, MissionParams._type, values);
  }

  public serialize() {
    const formattedParams = super.serialize();
    return formattedParams;
  }

  public deserialize(json: any): void {
    super.deserialize(json);
  }
}
