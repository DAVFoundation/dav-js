import BasicParams from './BasicParams';
import IPrice from './IPrice';
import { ID } from './common-types';

export default abstract class BidParams extends BasicParams {

    public constructor(public price: IPrice, public vehicleId: ID) {
        super();
    }
}
