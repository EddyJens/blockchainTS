import { GENESIS_DATA, MINE_RATE } from  "../config"
import { cryptoHash } from "../util/crypto-hash"
//@ts-ignore 
import hexToBinary from 'hex-to-binary'

interface blockObject {
  timestamp?: Number,
  lastHash?: String,
  hash?: String,
  data?: Array<String>
  nonce?: number,
  difficulty?: Number
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
  difficulty?: Number

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
    let { difficulty } = minedBlockObject.lastBlock
    let nonce = 0

    do {
      nonce++
      timestamp = Date.now()
      difficulty = Block.adjustDifficulty(minedBlockObject.lastBlock, timestamp )
      hash = cryptoHash(timestamp, lastHash, minedBlockObject.data, nonce, difficulty)
    } while (hexToBinary(hash).substring(0, Number(difficulty)) !== '0'.repeat(Number(difficulty)))

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

    if (Number(difficulty) < 1) return 1

    const difference = Number(timestamp) - Number(originalBlock.timestamp)

    if (difference > MINE_RATE) return Number(difficulty) - 1

    return Number(difficulty) + 1
  }
}