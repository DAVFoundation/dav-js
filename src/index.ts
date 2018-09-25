import SDKFactory from './SDKFactory';
import Mission from './Mission';
import Bid from './Bid';
import IConfig from './IConfig';
import Config from './Config';
import Message from './Message';
import Need from './Need';
import KafkaNode from './KafkaNode';
import KafkaMessageFactory, { MessageCategories } from './KafkaMessageFactory';
import CommitmentRequestParams from './CommitmentRequestParams';
import CommitmentConfirmationParams from './CommitmentConfirmationParams';

export {
  SDKFactory,
  Mission,
  Bid,
  IConfig,
  Config,
  Message,
  Need,
  KafkaNode,
};

KafkaMessageFactory.instance.registerMessageClasses([
  {
    protocol: CommitmentRequestParams._protocol, messageType: CommitmentRequestParams._messageType,
    messageCategory: MessageCategories.Message, classType: CommitmentRequestParams,
  },
  {
    protocol: CommitmentConfirmationParams._protocol, messageType: CommitmentConfirmationParams._messageType,
    messageCategory: MessageCategories.Message, classType: CommitmentConfirmationParams,
  },
]);
