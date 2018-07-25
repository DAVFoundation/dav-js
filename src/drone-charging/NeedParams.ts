import BaseNeedParams from '../NeedParams';

export default class NeedParams extends BaseNeedParams {

    constructor(values: Partial<NeedParams>) { super(); }

    public toJson(): string {
        throw new Error('Method not implemented.');
    }
}
