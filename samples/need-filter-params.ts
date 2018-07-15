import BasicParams from './basic-params';

export default abstract class NeedFilterParams extends BasicParams {
    public area?: {
      lat: number;
      long: number;
      radius: number; // service radius in meters
    }; // if null then it is a global service (not limited to a geographic area)
  }