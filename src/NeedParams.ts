import BasicParams from './BasicParams';
import { ID } from './common-types';

export default abstract class NeedParams extends BasicParams {
    public id: ID;
    constructor() {
        super();
    }
}
