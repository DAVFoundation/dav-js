import Bid from './Bid';

describe('Bid class', () => {
  let config;

  beforeAll(() => {
    config = {BidParams: 'BidParams'};
  });

  describe('accept method', () => {
    beforeAll(() => { /**/ });

    it('should success', async () => {
      const bid = new Bid('bidId', config);
      // Initialize bid
      try {
        await bid.accept();
      } catch (err) {
          console.log(err);
          fail();
      }
    });

    it('should throw due to topic creation failure', async () => {
      const bid = new Bid('bidId', config);
      // Initialize bid
      expect(await bid.accept()).toThrow('topic creation failure exception');
    });

    it('should throw due to kafka excpetion after sending message', async () => {
      const bid = new Bid('bidId', config);
      // Initialize bid
      expect(await bid.accept()).toThrow('kafka connection failure exception');
    });
  });

  describe('signContract method', () => {
    beforeAll(() => { /**/ });

    it('should success', async () => {
      const bid = new Bid('bidId', config);
      const privateKey = 'valid private key';
      // Initialize bid
      try {
        await bid.signContract(privateKey);
      } catch (err) {
          console.log(err);
          fail();
      }
    });

    it('should throw due to invalid private key', async () => {
      const bid = new Bid('bidId', config);
      const privateKey = 'invalid private key';
      // Initialize bid
      expect(await bid.signContract(privateKey)).toThrow('invalid private key exception');
    });

    it('should throw due to timeout exception', async () => {
      const bid = new Bid('bidId', config);
      const privateKey = 'valid private key';
      // Initialize bid
      expect(await bid.signContract(privateKey)).toThrow('timeout exception');
    });
  });
});
