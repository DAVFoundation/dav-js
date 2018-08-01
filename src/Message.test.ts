import Message from './Message';
import Bid from './Bid';
import Config from './Config';
import BidParams from './drone-delivery/BidParams';
import Mission from './Mission';
import { MessageStatus, MessageDomain } from './common-enums';
import MessageParams from './drone-charging/MessageParams';

describe('Message class', () => {

  const configuration = new Config({});
  const bidParams = new BidParams({});
  const bid = new Bid('needId', 'needTypeId', bidParams, configuration);
  const mission = new Mission('selfId', 'peerId', 'davId', configuration);
  const message = new Message('selfId', 'peerId', bid, mission, new MessageParams({status: MessageStatus.accepted}), configuration);

  beforeAll(() => {
    /**/
  });

  describe('respond method', () => {
    beforeAll(() => { /**/ });

    it('should send a message', async () => {
      expect(await message.respond('messageType', 'messagePayload')).toBe(false);
    });
  });

});
