import { GENESIS_DATA, MINE_RATE } from  "./config"
import { cryptoHash } from "./crypto-hash"

interface blockObject {
  timestamp?: Number,
  lastHash?: String,
  hash?: String,
  data?: Array<String>
  nonce?: number,
  difficulty?: number
}

interface minedBlockObject {
  lastBlock: blockObject,
  data: Array<String>
}

export default class Block {
  timestamp?: Number
  lastHash?: String
  hash?: String
  data?: Array<String>
  nonce?: number
  difficulty?: number

  constructor(block: blockObject) {
    this.timestamp = block.timestamp
    this.lastHash = block.lastHash
    this.hash = block.hash
    this.data = block.data
    this.nonce = block.nonce
    this.difficulty = block.difficulty
  }

  static genesis() {
    return new Block(GENESIS_DATA)
  }

  static mineBlock(minedBlockObject: minedBlockObject) {
    let hash, timestamp
    const lastHash = minedBlockObject.lastBlock.hash
    const { difficulty } = minedBlockObject.lastBlock
    let nonce = 0

    do {
      nonce++
      timestamp = Date.now()
      hash = cryptoHash(timestamp, lastHash, minedBlockObject.data, nonce, difficulty)
    } while (hash.substring(0, difficulty) !== '0'.repeat(Number(difficulty)))

    return new this({
      timestamp,
      lastHash,
      data: minedBlockObject.data,
      difficulty,
      nonce,
      hash
    })
  }

  static adjustDifficulty(originalBlock: Block, timestamp: Number) {
    const { difficulty } = originalBlock

    const difference = Number(timestamp) - Number(originalBlock.timestamp)

    if (difference > MINE_RATE) return Number(difficulty) - 1

    return Number(difficulty) + 1
  }
}