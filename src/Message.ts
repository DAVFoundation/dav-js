import { MessageStatus, MessageDomain } from './enums';
import Bid from './Bid';
import Mission from './Mission';

export default class Message {
    public bid: Bid;
    public mission: Mission;
    public status: MessageStatus;
    public domain: MessageDomain;

    public respond(type: string, payload: any) { /**/ }
}
