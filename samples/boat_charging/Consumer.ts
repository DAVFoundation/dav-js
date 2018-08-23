import SDKFactory from '../../src/SDKFactory';
import Config from '../../src/Config';
import NeedParams from '../../src/boat-charging/NeedParams';
import BidParams from '../../src/boat-charging/BidParams';
import MissionParams from '../../src/boat-charging/MissionParams';
import MessageParams from '../../src/boat-charging/MessageParams';
import Identity from '../../src/Identity';

const printLine = () => console.log('====================================================================================================');

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
    const needParams = new NeedParams({
      location: {
        latitude: 32.050382,
        longitude: 34.766149,
      },
    });
    const missionParams = new MissionParams({
    });
    const messageParams = new MessageParams({
    });

    const need = await this.identity.publishNeed(needParams);
    const needMessages = await need.messages(MessageParams);
    needMessages.take(1).subscribe((message) => {
      console.log('Need message: ', message);
      printLine();
      message.respond(messageParams);
    });

    const bids = await need.bids(BidParams);
    bids.subscribe(async (bid) => {
      bid.sendMessage(messageParams);
      const bidMessages = await bid.messages(MessageParams);
      bidMessages.take(1).subscribe((message) => {
        console.log('Bid message respond: ', message);
        printLine();
      });

      const mission = await bid.accept(missionParams, this._privateKey);
      const missionMessages = await mission.messages(MessageParams);
      missionMessages.take(1).subscribe((message) => {
        console.log('Mission message: ', message);
        printLine();
        message.respond(messageParams);
      });

      const startMissionTransactionReceipt = await mission.signContract(this._privateKey);
      console.log('Start mission transaction receipt:', startMissionTransactionReceipt);
      printLine();
      const finalizeMissionTransactionReceipt = await mission.finalizeMission(this._privateKey);
      console.log('Finalize mission transaction receipt: ', finalizeMissionTransactionReceipt);
      printLine();
    });
  }
}
