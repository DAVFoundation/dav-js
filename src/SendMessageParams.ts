import ISendMessageParams from './ISendMessageParams';
import { ID } from './common-types';

export default class SendMessageParams implements ISendMessageParams {
    constructor(public recipients?: ID[]) {
        /* */
    }
}
