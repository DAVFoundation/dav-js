import SDKFactory from '../../src/SDKFactory';
import Identity from '../../src/Identity';
import Config from '../../src/Config';
import NeedFilterParams from '../../src/boat-charging/NeedFilterParams';
import NeedParams from '../../src/boat-charging/NeedParams';
import BidParams from '../../src/boat-charging/BidParams';
import MissionParams from '../../src/boat-charging/MissionParams';
import MessageParams from '../../src/boat-charging/MessageParams';
import { EnergySources, Amenities } from '../../src/boat-charging/enums';
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

    let messageParams = new MessageParams({
    });
    // Subscribe for bid needs
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
    const needs = await this.identity.needsForType(needFilterParams, NeedParams);
    needs.subscribe(async (need) => {

      // Send message for need.
      messageParams = new MessageParams({
      });
      need.sendMessage(messageParams);

      // Subscribe for an answer
      const needMessages = await need.messages(MessageParams);
      needMessages.take(1).subscribe((message) => {
        console.log('Need message respond: ', message);
        printLine();
      });

      // Create bid
      const bidParams = new BidParams({
        price: '100000000000000000',
        vehicleId: this.davId,
        entranceLocation: {
          lat: 32.050382,
          long: 34.766149,
        },
        exitLocation: {
          lat: 32.050382,
          long: 34.766149,
        },
        availableFrom: 1535441613658,
        availableUntil: 1535441623658,
        energySource: EnergySources.hydro,
        amenities: [Amenities.Park],
        provider: 'N3m0',
        manufacturer: 'manufacturer_name',
        model: 'model_name',
      });
      const bid = await need.createBid(bidParams);

      // Subscribe for bid messages
      const bidMessages = await bid.messages(MessageParams);
      bidMessages.take(1).subscribe((message) => {

        // Respond for bid message
        messageParams = new MessageParams({
        });
        message.respond(messageParams);
        console.log('Bid message: ', message);
        printLine();
      });

      // Subscribe for bid missions
      const missions = await bid.missions(MissionParams);
      missions.subscribe(async (mission) => {

        // Send message for mission.
        messageParams = new MessageParams({
        });
        mission.sendMessage(messageParams);

        // Subscribe for an answer
        const missionMessages = await mission.messages(MessageParams);
        missionMessages.take(1).subscribe((message) => {
          console.log('Mission message respond: ', message);
          printLine();
        });
      });
    });
  }
}
