import BasicParams from './BasicParams';
import { DavID } from './common-types';
import { LatLonSpherical as LatLon } from 'geodesy';

/**
 * @class The abstract Class NeedFilterParams represent common parameters of NeedFilterParams classes.
 */
export default abstract class NeedFilterParams extends BasicParams {
  /**
   * @property The service provider supported area, if null then it is a global service (not limited to a geographic area).
   */
  public area?: {
    /**
     * @property supported area latitude.
     */
    lat: number;
    /**
     * @property supported area longitude.
     */
    long: number;
    /**
     * @property supported radius in meters.
     */
    radius: number;
  };
  /**
   * @property Provider Dav ID.
   */
  public davId: DavID;

  constructor(values: Partial<NeedFilterParams>) {
    super(values);
    this.area = values.area;
  }

  public getFormatedParams() {
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
    const formatedParams = JSON.parse(this.toJson());
    formatedParams.area = formatArea(formatedParams.area);
    return formatedParams;
  }

}
