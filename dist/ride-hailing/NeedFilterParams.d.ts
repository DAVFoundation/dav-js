import BaseNeedFilterParams from '../NeedFilterParams';
/**
 * @class The Class ride-hailing/NeedFilterParams represent the parameters that used to filter ride-hailing needs.
 */
export default class NeedFilterParams extends BaseNeedFilterParams {
    static _protocol: string;
    static _messageType: string;
    constructor(values?: Partial<NeedFilterParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
}
