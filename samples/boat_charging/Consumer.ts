import SDKFactory from '../../src/SDKFactory';
import Config from '../../src/Config';
import NeedParams from '../../src/boat-charging/NeedParams';
import BidParams from '../../src/boat-charging/BidParams';
import MissionParams from '../../src/boat-charging/MissionParams';
import MessageParams from '../../src/boat-charging/MessageParams';
import Identity from '../../src/Identity';
import { EnergySources, Amenities } from '../../src/boat-charging/enums';
import Mission from '../../src/Mission';
import Bid from '../../src/Bid';

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

  public async start() {

    const need = await this.createNeed();
    const bids = await need.bids(BidParams);
    bids.subscribe(async (bid) => {
      console.log('Bid received: ', bid);
      printLine();
      const mission = await this.createMission(bid);
      this.simulateMission(mission);
    });
  }

  public async createNeed() {
    const needParams = new NeedParams({
      location: {
        lat: 32.050382,
        long: 34.766149,
      },
      startAt: 1535441613658,
      dimensions: {
        length: 1,
        width: 1,
        height: 1,
        weight: 2,
      },
      batteryCapacity: 40,
      currentBatteryCharge: 10,
      energySource: EnergySources.hydro,
      amenities: [Amenities.Park],
    });
    const need = await this.identity.publishNeed(needParams);
    return need;
  }

  public async createMission(bid: Bid<BidParams, MessageParams>) {
    const missionParams = new MissionParams({
    });
    const mission = await bid.accept(missionParams, this._privateKey);
    return mission;
  }


  public async simulateMission(mission: Mission<MissionParams>) {



      // Commit payment
      const startMissionTransactionReceipt = await mission.signContract(this._privateKey);
      console.log('Start mission transaction receipt:', startMissionTransactionReceipt);
      printLine();

      // Approve mission is completed
      const finalizeMissionTransactionReceipt = await mission.finalizeMission(this._privateKey);
      console.log('Finalize mission transaction receipt: ', finalizeMissionTransactionReceipt);
      printLine();
  }

}

