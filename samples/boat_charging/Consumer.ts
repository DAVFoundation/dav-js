import SDKFactory from '../../src/SDKFactory';
import Config from '../../src/Config';
import NeedParams from '../../src/boat-charging/NeedParams';
import BidParams from '../../src/boat-charging/BidParams';
import MissionParams from '../../src/boat-charging/MissionParams';
import MessageParams from '../../src/boat-charging/MessageParams';
import Identity from '../../src/Identity';

const needParams = new NeedParams({
  location: {
    latitude: 32.050382,
    longitude: 34.766149,
  },
});
const missionParams = new MissionParams({
  vehicleId: '0x48a699a79fB7d2a7E9096df09f426837369d1F85',
  neederDavId: '0xFEDdDcBf94cB620d6D92D049b75fc7062a3E2Fc6',
});
const messageParams = new MessageParams({
});
const sdkConfiguration = {
  apiSeedUrls: ['http://localhost'],
  kafkaSeedUrls: ['localhost:9092'],
};

export default class Consumer {
  private _privateKey: string;
  public identity: Identity;

  public async init(davId: string, privateKey: string) {
    this._privateKey = privateKey;
    const config = new Config(sdkConfiguration);
    const davSDK = SDKFactory(config);
    // try {
    //   await davSDK.registerIdentity(davId, davId, privateKey, privateKey);
    // } catch (err) {
    //   /**/
    // }
    if (await davSDK.isRegistered(davId)) {
      this.identity = await davSDK.getIdentity(davId);
    } else {
      throw new Error('Consumer: Identity is not registered');
    }
}

  public async createNeed() {
    const need = await this.identity.publishNeed(needParams);
    const needMessages = await need.messages(MessageParams);
    needMessages.take(1).subscribe((message) => {
      console.log('Need message: ', message);
      message.respond(messageParams);
    });
    needMessages.take(2).subscribe((message) => {
      console.log('Bid message respond: ', message);
    });
    const bids = await need.bids(BidParams);
    bids.subscribe(async (bid) => {
      bid.sendMessage(messageParams);
      const mission = await bid.accept(missionParams, this._privateKey);
      const missionMessages = await mission.messages(MessageParams);
      missionMessages.take(1).subscribe((message) => {
        console.log('Mission message: ', message);
        message.respond(messageParams);
      });
      mission.signContract(this._privateKey);
      mission.finalizeMission(this._privateKey);
    });
  }
}
