import ISendMessageParams from './ISendMessageParams';
import { ID } from './common';

export default class SendMessageParams implements ISendMessageParams {
    constructor(public recipients?: ID[]) {
        /* */
    }
}
