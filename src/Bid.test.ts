import Bid from './Bid';
import Config from './Config';
import BidParams from './drone-delivery/BidParams';

describe('Bid class', () => {
  const config = new Config({});
  const bidParams = new BidParams({});

  beforeAll(() => { /**/ });

  describe('accept method', () => {
    beforeAll(() => { /**/ });

    xit('should success', async () => {
      const bid = new Bid('needId', 'needTypeId', bidParams, config);
      // Initialize bid
      await bid.accept();
    });

    xit('should throw due to topic creation failure', async () => {
      const bid = new Bid('needId', 'needTypeId', bidParams, config);
      // Initialize bid
      expect(await bid.accept()).toThrow('topic creation failure exception');
    });
  });

  describe('signContract method', () => {
    beforeAll(() => { /**/ });

    xit('should success, validate mission selfId', async () => {
      const bid = new Bid('needId', 'needTypeId', bidParams, config);
      const privateKey = 'valid private key';
      // Initialize bid, add consumer topic before sign
      const mission = await bid.signContract(privateKey);
      expect(mission.selfId).toBe('new consumer topic created in accept method');
    });

    xit('should throw due to invalid private key', async () => {
      const bid = new Bid('needId', 'needTypeId', bidParams, config);
      const privateKey = 'invalid private key';
      // Initialize bid
      expect(await bid.signContract(privateKey)).toThrow('invalid private key exception');
    });

    xit('should throw due to web3 exception', async () => {
      const bid = new Bid('needId', 'needTypeId', bidParams, config);
      const privateKey = 'valid private key';
      // Initialize bid
      expect(await bid.signContract(privateKey)).toThrow('web3 exception');
    });
  });

  describe('messages method', () => {
    beforeAll(() => { /**/ });

    xit('should success', () => {
      const bid = new Bid('needId', 'needTypeId', bidParams, config);
      // Initialize bid
      // mock accept, because messages method had to be called after bid has topic Id
      bid.messages();
    });

    xit('should throw due to absence of topic creation', () => {
      const bid = new Bid('needId', 'needTypeId', bidParams, config);
      // Initialize bid
      expect(bid.messages()).toThrow('no topic to listen for');
    });
  });
});
