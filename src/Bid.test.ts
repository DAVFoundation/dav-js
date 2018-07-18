import Bid from './Bid';
import Config from './Config';

describe('Bid class', () => {
  const config = new Config();

  beforeAll(() => { /**/ });

  describe('accept method', () => {
    beforeAll(() => { /**/ });

    it('should success', async () => {
      const bid = new Bid('needId', 'needTypeId', config);
      // Initialize bid
      try {
        await bid.accept();
      } catch (err) {
          console.log(err);
          fail();
      }
    });

    it('should throw due to topic creation failure', async () => {
      const bid = new Bid('needId', 'needTypeId', config);
      // Initialize bid
      expect(await bid.accept()).toThrow('topic creation failure exception');
    });

    it('should throw due to kafka excpetion after sending message', async () => {
      const bid = new Bid('needId', 'needTypeId', config);
      // Initialize bid
      expect(await bid.accept()).toThrow('kafka connection failure exception');
    });
  });

  describe('signContract method', () => {
    beforeAll(() => { /**/ });

    it('should success', async () => {
      const bid = new Bid('needId', 'needTypeId', config);
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
      const bid = new Bid('needId', 'needTypeId', config);
      const privateKey = 'invalid private key';
      // Initialize bid
      expect(await bid.signContract(privateKey)).toThrow('invalid private key exception');
    });

    it('should throw due to timeout exception', async () => {
      const bid = new Bid('needId', 'needTypeId', config);
      const privateKey = 'valid private key';
      // Initialize bid
      expect(await bid.signContract(privateKey)).toThrow('timeout exception');
    });
  });
});
