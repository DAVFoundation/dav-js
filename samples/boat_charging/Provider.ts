import SDKFactory from '../../src/SDKFactory';
import Identity from '../../src/Identity';
import Config from '../../src/Config';
import NeedFilterParams from '../../src/boat-charging/NeedFilterParams';
import NeedParams from '../../src/boat-charging/NeedParams';
import BidParams from '../../src/boat-charging/BidParams';
import MissionParams from '../../src/boat-charging/MissionParams';
import MessageParams from '../../src/boat-charging/MessageParams';

const printLine = () => console.log('====================================================================================================');

const sdkConfiguration = {
  apiSeedUrls: ['http://localhost'],
  kafkaSeedUrls: ['localhost:9092'],
};

export default class Provider {
  private _privateKey: string;
  public davId: string;
  public identity: Identity;

  public async init(davId: string, privateKey: string) {
    this._privateKey = privateKey;
    this.davId = davId;
    const config = new Config(sdkConfiguration);
    const davSDK = SDKFactory(config);
    // try {
    //     await davSDK.registerIdentity(davId, davId, privateKey, privateKey);
    //   } catch (err) {
    //     /**/
    //   }
    if (await davSDK.isRegistered(davId)) {
      this.identity = await davSDK.getIdentity(davId);
    } else {
      throw new Error('Provider: Identity is not registered');
    }
  }

  public async subscribeForNeeds() {
    const needFilterParams = new NeedFilterParams({
      area: {
        lat: 32.050382,
        long: 34.766149,
        radius: 4000,
      },
      davId: this.davId,
      maxDimensions: {
        length: 1,
        width: 1,
        height: 2,
        weight: 5,
      },
    });

    const bidParams = new BidParams({
      price: '100000000000000000',
      vehicleId: this.davId,
    });

    const messageParams = new MessageParams({

    });
    const needs = await this.identity.needsForType(needFilterParams, NeedParams);
    needs.subscribe(async (need) => {
      need.sendMessage(messageParams);
      const needMessages = await need.messages(MessageParams);
      needMessages.take(1).subscribe((message) => {
        console.log('Need message respond: ', message);
        printLine();
      });

      const bid = await need.createBid(bidParams);

      const bidMessages = await bid.messages(MessageParams);
      bidMessages.take(1).subscribe((message) => {
        console.log('Bid message: ', message);
        printLine();
        message.respond(messageParams);
      });

      const missions = await bid.missions(MissionParams);
      missions.subscribe(async (mission) => {
        mission.sendMessage(messageParams);
        const missionMessages = await mission.messages(MessageParams);
        missionMessages.take(1).subscribe((message) => {
          console.log('Mission message respond: ', message);
          printLine();
        });
      });
    });
  }
}
