import { v4 as uuidV4 } from 'uuid';

export default abstract class KafkaBase {
  public generateTopicId(): string {
    return uuidV4();
  }
}
