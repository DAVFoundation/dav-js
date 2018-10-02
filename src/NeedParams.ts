import BasicParams from './BasicParams';
import { ID, DavID, ILocation } from './common-types';

/**
 * @class The abstract Class NeedParams represent common parameters of NeedParams classes.
 */
export default abstract class NeedParams extends BasicParams {
  /**
   * @property The need's topic id (used to send messages and bids to consumer).
   */
  public id: ID;
  /**
   * @property The need's topic id (used to send messages and bids to consumer).
   */
  public davId: DavID;
  /**
   * @property The consumer current location.
   */
  public location: ILocation;

  constructor(protocol: string, type: string, values?: Partial<NeedParams>) {
    super(protocol, type, values);
    if (!!values) {
      this.id = values.id;
      this.davId = values.davId;
      if (!!values.location) {
        this.location = {
          lat: values.location.lat,
          long: values.location.long,
        };
      }
    }
  }

  public serialize() {
    const formattedParams = super.serialize();
    Object.assign(formattedParams, {
      id: this.id,
      location: {
        latitude: this.location && this.location.lat,
        longitude: this.location && this.location.long,
      },
      davId: this.davId,
    });
    return formattedParams;
  }

  public deserialize(json: any): void {
    super.deserialize(json);
    this.id = json.id;
    this.location = {
      lat: json.location && json.location.latitude,
      long: json.location && json.location.longitude,
    };
    this.davId = json.davId;
  }
}
