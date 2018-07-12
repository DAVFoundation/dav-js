// tslint:disable:max-classes-per-file
import * as Core from './core';

export class NeedFilterParams extends Core.NeedFilterParams {
    constructor(values: Partial<NeedFilterParams>) { super(); }
    public toString(): string { return ''; }
}

export class NeedParams extends Core.NeedParams {
    constructor(values: Partial<NeedParams>) { super(); }
}

export class BidParams extends Core.BidParams {
    public plugType: string;

    constructor(init?: Partial<BidParams>) {
        super();
    }

    public toString(): string { return ''; }
}
