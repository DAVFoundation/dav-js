import SDKFactory from '../../src/SDKFactory';
import Identity from '../../src/Identity';
import Config from '../../src/Config';
import NeedFilterParams from '../../src/boat-charging/NeedFilterParams';
import NeedParams from '../../src/boat-charging/NeedParams';
import BidParams from '../../src/boat-charging/BidParams';
import MissionParams from '../../src/boat-charging/MissionParams';
import MessageParams from '../../src/boat-charging/MessageParams';
import { EnergySources, Amenities } from '../../src/boat-charging/enums';
import Need from '../../src/Need';
import Bid from '../../src/Bid';
import { Observable } from 'rxjs';
import Mission from '../../src/Mission';
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

  public async start() {
    const needs = await this.getNeeds();
    needs.subscribe(async (need) => {
      console.log('Need received: ', need);
      printLine();
      const bid = await this.createBid(need);
      const missions = await bid.missions(MissionParams);
      missions.subscribe(async (mission) => {
        console.log('Mission received: ', mission);
        printLine();
        this.simulateMission(mission);
      });
    });
  }

  public async getNeeds() {
    const needFilterParams = new NeedFilterParams({
      location: {
        lat: 32.050382,
        long: 34.766149,
      },
      radius: 4000,
      davId: this.davId,
      maxDimensions: {
        length: 1,
        width: 1,
        height: 2,
        weight: 5,
      },
    });
    const needs = await this.identity.needsForType(needFilterParams, NeedParams);
    return needs;
  }

  public async createBid(need: Need<NeedParams, MessageParams>): Promise<Bid<BidParams, MessageParams>> {
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
    return bid;
  }

  public async simulateMission(mission: Mission<MissionParams>) {
    /**/
  }

}
