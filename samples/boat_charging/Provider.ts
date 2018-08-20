import SDKFactory from '../../src/SDKFactory';
import Identity from '../../src/Identity';
import Config from '../../src/Config';
import NeedFilterParams from '../../src/boat-charging/NeedFilterParams';
import NeedParams from '../../src/boat-charging/NeedParams';
import BidParams from '../../src/boat-charging/BidParams';
import MissionParams from '../../src/boat-charging/MissionParams';
import MessageParams from '../../src/boat-charging/MessageParams';

const sdkConfiguration = {
    apiSeedUrls: ['http://localhost'],
    kafkaSeedUrls: ['localhost:9092'],
};

const needFilterParams = new NeedFilterParams({
    area: {
      lat: 32.050382,
      long: 34.766149,
      radius: 4000,
    },
  });

const bidParams = new BidParams({
    price: '100000000000000000',
    vehicleId: '0x48a699a79fB7d2a7E9096df09f426837369d1F85',
  });

const messageParams = new MessageParams({

});

export default class Provider {
    private _privateKey: string;
    public identity: Identity;

    public async init(davId: string, privateKey: string) {
        this._privateKey = privateKey;
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
      const needs = await this.identity.needsForType(needFilterParams, NeedParams);
      needs.subscribe(async (need) => {
        need.sendMessage(messageParams);
        const bid = await need.createBid(bidParams);
        const bidMessages = await bid.messages(MessageParams);
        bidMessages.take(1).subscribe((message) => {
          console.log('Bid message: ', message);
          message.respond(messageParams);
        });
        bidMessages.take(2).subscribe((message) => {
          console.log('Mission message respond: ', message);
        });
      });
      const missions = await this.identity.missions(MissionParams);
      missions.subscribe((mission) => {
          mission.sendMessage(messageParams);
      });
      const messages = await this.identity.messages(MessageParams);
      messages.take(1).subscribe((message) => {
        console.log('Need message respond: ', message);
      });
    }
  }
