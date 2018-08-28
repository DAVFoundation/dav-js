import BasicParams from './BasicParams';
import { DavID, IArea } from './common-types';
import { LatLonSpherical as LatLon } from 'geodesy';

/**
 * @class The abstract Class NeedFilterParams represent common parameters of NeedFilterParams classes.
 */
export default abstract class NeedFilterParams extends BasicParams {
  /**
   * @property The service provider supported area, if null then it is a global service (not limited to a geographic area).
   */
  public area?: IArea;
  /**
   * @property Provider Dav ID.
   */
  public davId: DavID;

  public static deserialize(json: any) {
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
    const needFilterParams = super.deserialize(json);
    Object.assign(needFilterParams, {
      davId: json.dav_id,
      area: formatArea(json.area),
    });
    return needFilterParams as NeedFilterParams;
  }

  constructor(values: Partial<NeedFilterParams>, protocol: string, type: string) {
    super(values, protocol, type);
    this.area = values.area;
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
      area: formatArea(this.area),
    });
    return formattedParams;
  }

}
