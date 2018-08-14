/**
 * @enum The enum PriceType represent the type of the price of the service.
 */
export enum PriceType {
    flat = 'flat',
}
/**
 * @enum The enum MessageStatus represent the status of the sent message.
 */
export enum MessageStatus {
    accepted = 'accepted',
    contractSigned = 'contract_signed',
}
/**
 * @enum The enum MessageDomain represent the message origin.
 */
export enum MessageDomain {
    mission = 'mission',
    bid = 'bid',
}
/**
 * @enum The enum BlockchainType represent the type of the blockchain network.
 */
export enum BlockchainType {
    local = 'local',
    test = 'ropsten',
    main = 'main',
}
/**
 * @enum The enum ContractTypes represent the dav contracts names.
 */
export enum ContractTypes {
    identity = 'Identity',
    davToken = 'DAVToken',
    basicMission = 'BasicMission',
}
