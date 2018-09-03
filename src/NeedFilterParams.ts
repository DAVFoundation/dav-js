import BasicParams from './BasicParams';
import { DavID, ILocation } from './common-types';
import { LatLonSpherical as LatLon } from 'geodesy';

/**
 * @class The abstract Class NeedFilterParams represent common parameters of NeedFilterParams classes.
 */
export default abstract class NeedFilterParams extends BasicParams {
  /**
   * @property The service provider location.
   */
  public location: ILocation;
  /**
   * @property The service provider max supported distance. if null then it is a global service (not limited to a geographic area)
   */
  public radius: number;
  /**
   * @property Provider Dav ID.
   */
  public davId: DavID;

  constructor(protocol: string, type: string, values?: Partial<NeedFilterParams>) {
    super(protocol, type, values);
    if (!!values) {
      this.location = values.location;
      this.davId = values.davId;
      this.radius = values.radius;
    }
  }

  public serialize() {
    const formatArea = (area: any) => {
      const center = new LatLon(area.lat, area.long);
      const distance = area.radius * Math.sqrt(2);
      const topLeft = center.destinationPoint(distance, 45);
      const bottomRight = center.destinationPoint(-distance, 45);
      return {
        max: {
          latitude: topLeft.lat,
          longitude: topLeft.lon,
        },
        min: {
          latitude: bottomRight.lat,
          longitude: bottomRight.lon,
        },
      };
    };
    const formattedParams = super.serialize();
    Object.assign(formattedParams, {
      dav_id: this.davId,
      area: formatArea({ ...this.location, radius: this.radius }),
    });
    return formattedParams;
  }

  public deserialize(json: any): void {
    super.deserialize(json);
    const formatArea = (area: any) => {
      const topLeft = new LatLon(area.max.latitude, area.max.longitude);
      const bottomRight = new LatLon(area.min.latitude, area.min.longitude);
      const distance = topLeft.distanceTo(bottomRight);
      const center = topLeft.intermediatePointTo(bottomRight, 0.5);
      return {
        lat: center.lat,
        long: center.lon,
        radius: (distance * 1000) / 2,
      };
    };
    const formattedArea = formatArea(json.area);
    this.davId = json.dav_id;
    this.location = {lat: formattedArea.lat, long: formattedArea.long};
    this.radius = formattedArea.radius;
  }
}
