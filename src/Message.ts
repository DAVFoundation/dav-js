import IMessage from './IMessage';
import { MessageStatus, MessageDomain } from './enums';
// ToDo: import Bid from './Bid';
// ToDo: import Bid from './Bid';

/* tslint:disable *//*ToDo: delete*/class Bid { constructor(params) { } }
/*ToDo: delete*/class Mission { constructor(params) { } }/* tslint:enable */// tslint:disable:max-classes-per-file

export default class Message implements IMessage {
    public bid: Bid;
    public mission: Mission;
    public status: MessageStatus;
    public domain: MessageDomain;

    public respond(type: string, payload: any) { /**/ }
}