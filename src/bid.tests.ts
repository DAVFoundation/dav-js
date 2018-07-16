import { IBid } from './IBid';

describe('Bid class', () => {
  beforeAll(() => { /**/ });

  describe('accept method', () => {
    beforeAll(() => { /**/ });

    it('should success', async () => {
      let bid: IBid;
      // Initialize bid
      try {
        await bid.accept();
      } catch (err) {
          console.log(err);
          fail();
      }
    });

    it('should fail', async () => {
      let bid: IBid;
      // Initialize bid
      expect(await bid.accept()).toThrow('some exception');
    });
  });

  describe('signContract method', () => {
    beforeAll(() => { /**/ });

    it('should success', async () => {
      let bid: IBid;
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
      let bid: IBid;
      const privateKey = 'invalid private key';
      // Initialize bid
      expect(await bid.signContract(privateKey)).toThrow('some exception');
    });
  });
});
