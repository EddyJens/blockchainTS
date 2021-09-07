import redis, { RedisClient } from 'redis'
import Blockchain from './blockchain'

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN'
}

export default class PubSub {
  publisher: RedisClient
  subscriber: RedisClient
  blockchain: Blockchain

  constructor(blockchain: Blockchain) {
    this.blockchain = blockchain
    this.publisher = redis.createClient()
    this.subscriber = redis.createClient()

    this.subscribeToChannels()

    this.subscriber.on(
      'message', 
      (channel, message) => this.handleMessage(channel, message)
    )
  }

  handleMessage(channel: string, message: string) {
    console.log(`Message received. Channel: ${channel}. Message: ${message}`)

    const parsedMessage = JSON.parse(message)

    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replaceChain(parsedMessage)
    }
  }

  subscribeToChannels() {
    Object.values(CHANNELS).forEach(channel => {
      this.subscriber.subscribe(channel)
    })
  }

  publish (channel: string, message: string) {
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel)
      })
    })
  }

  broadcastChain() {
    this.publish(CHANNELS.BLOCKCHAIN, JSON.stringify(this.blockchain.chain))
  }
}