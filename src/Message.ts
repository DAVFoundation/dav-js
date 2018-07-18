import IConfig from './IConfig';
import { ID } from './common';
import { MessageStatus, MessageDomain } from './enums';
import Bid from './Bid';
import Mission from './Mission';

export default class Message {
    constructor(public selfId: ID, public peerId: ID, private config: IConfig) { /**/ }
    public respond(type: string, payload: any) { /**/ }
}
