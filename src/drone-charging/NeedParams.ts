import BaseNeedParams from '../NeedParams';

export default class NeedParams extends BaseNeedParams {

    public static fromJson(json: string): NeedParams {
        throw new Error('Method not implemented.');
    }

    constructor(values: Partial<NeedParams>) { super(); }

    public toJson(): string {
        throw new Error('Method not implemented.');
    }
}
