import Config from './Config';
import BidParams from './drone-charging/BidParams';
// jest.doMock('./Contracts');
// import Bid from './Bid';
import Price from './Price';
import { PriceType } from './common-enums';
import Contracts from './Contracts';
import { DavID, ID, BigInteger } from './common-types';
import IConfig from './IConfig';

describe('Bid class', () => {
  const config = new Config({});
  jest.doMock('./drone-charging/BidParams');
  const bidParams = new BidParams({
    price: new Price('3', PriceType.flat),
    vehicleId: '34',
  });

  xdescribe('accept method', () => {
    beforeAll(() => { /**/ });

    // it('should success', async () => {
    //   const bid = new Bid('needId', 'needTypeId', bidParams, config);
    //   // Initialize bid
    //   await bid.accept();
    // });

    // it('should throw due to topic creation failure', async () => {
    //   const bid = new Bid('needId', 'needTypeId', bidParams, config);
    //   // Initialize bid
    //   expect(await bid.accept()).toThrow('topic creation failure exception');
    // });
  });

  describe('signContract method', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should succeed, validate mission object', async () => {
      // Arrange
      const contractsMock = {
        approveMission: () => Promise.resolve(''),
        startMission: () => Promise.resolve(''),
      };
      jest.doMock('./Contracts', () => ({default: contractsMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);
      const privateKey = 'valid private key';
      const davId = 'davId';
      // Initialize bid, add consumer topic before sign

      // Act
      const mission = await bid.signContract(privateKey, davId);

      // Assert
      expect(mission.selfId).toBeUndefined();
      expect(mission.peerId).toBe('needTypeId');
      expect(mission.neederDavId).toBe(davId);
    });

    it('should succeed, validate approveMission method', async () => {
      // Arrange
      const approveContractVerifiable = jest.fn();
      approveContractVerifiable.mockResolvedValue('');
      const contractsMock = {
        approveMission: (key: string, dav: DavID, configParam: IConfig) => approveContractVerifiable(key, dav, configParam),
        startMission: () => Promise.resolve(''),
      };
      jest.doMock('./Contracts', () => ({default: contractsMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);
      const privateKey = 'valid private key';
      const davId = 'davId';
      // Initialize bid, add consumer topic before sign

      // Act
      const mission = await bid.signContract(privateKey, davId);

      // Assert
      expect(approveContractVerifiable).toHaveBeenCalledWith(davId, privateKey, config);
    });

    it('should succeed, validate startMission method', async () => {
      // Arrange
      const startContractVerifiable = jest.fn();
      startContractVerifiable.mockResolvedValue('');
      const contractsMock = {
        approveMission: () => Promise.resolve(''),
        startMission: (missionId: ID, dav: DavID, key: string, vId: DavID, price: string, configParam: IConfig) =>
         startContractVerifiable(missionId, dav, key, vId, price, configParam),
      };
      jest.doMock('./Contracts', () => ({default: contractsMock}));
      // tslint:disable-next-line:variable-name
      const Bid = (await import('./Bid')).default;
      const bid = new Bid('needId', 'needTypeId', bidParams, config);
      const privateKey = 'valid private key';
      const davId = 'davId';
      // Initialize bid, add consumer topic before sign

      // Act
      const mission = await bid.signContract(privateKey, davId);

      // Assert
      expect(startContractVerifiable).toHaveBeenCalledWith(expect.any(String), davId, privateKey, '34', '3', config);
    });

    // xit('should throw due to invalid private key', async () => {
    //   const bid = new Bid('needId', 'needTypeId', bidParams, config);
    //   const privateKey = 'invalid private key';
    //   const davId = 'davId';
    //   // Initialize bid
    //   expect(await bid.signContract(davId, privateKey)).toThrow('invalid private key exception');
    // });

    // xit('should throw due to web3 exception', async () => {
    //   const bid = new Bid('needId', 'needTypeId', bidParams, config);
    //   const privateKey = 'valid private key';
    //   const davId = 'davId';
    //   // Initialize bid
    //   expect(await bid.signContract(davId, privateKey)).toThrow('web3 exception');
    // });
  });

  xdescribe('messages method', () => {
    beforeAll(() => { /**/ });

    // it('should success', () => {
    //   const bid = new Bid('needId', 'needTypeId', bidParams, config);
    //   // Initialize bid
    //   // mock accept, because messages method had to be called after bid has topic Id
    //   bid.messages();
    // });

    // it('should throw due to absence of topic creation', () => {
    //   const bid = new Bid('needId', 'needTypeId', bidParams, config);
    //   // Initialize bid
    //   expect(bid.messages()).toThrow('no topic to listen for');
    // });
  });
});
