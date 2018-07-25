import BaseNeedFilterParams from '../NeedFilterParams';

export default class NeedFilterParams extends BaseNeedFilterParams {

    constructor(values: Partial<NeedFilterParams>) { super(); }

    public toJson(): string {
        throw new Error('Method not implemented.');
    }
}
