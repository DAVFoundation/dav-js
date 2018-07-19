import BasicParams from './BasicParams';
import IPrice from './IPrice';

export default abstract class BidParams extends BasicParams {
    public price: IPrice;
}
