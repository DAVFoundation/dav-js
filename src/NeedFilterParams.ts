import BasicParams from './BasicParams';
import { DavID } from './common-types';
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
}
