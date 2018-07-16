import Bid from './Bid';

describe('Bid class', () => {
  beforeAll(() => { /**/ });

  describe('accept method', () => {
    beforeAll(() => { /**/ });

    it('should success', async () => {
      const bid = new Bid('123');
      // Initialize bid
      try {
        await bid.accept();
      } catch (err) {
          console.log(err);
          fail();
      }
    });

    it('should fail', async () => {
      const bid = new Bid('123');
      // Initialize bid
      expect(await bid.accept()).toThrow('some exception');
    });
  });

  describe('signContract method', () => {
    beforeAll(() => { /**/ });

    it('should success', async () => {
      const bid = new Bid('123');
      const privateKey = 'valid private key';
      // Initialize bid
      try {
        await bid.signContract(privateKey);
      } catch (err) {
          console.log(err);
          fail();
      }
    });

    it('should fail', async () => {
      const bid = new Bid('123');
      const privateKey = 'invalid private key';
      // Initialize bid
      expect(await bid.signContract(privateKey)).toThrow('some exception');
    });
  });
});
