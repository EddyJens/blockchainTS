import Block from './block'
import { cryptoHash } from '../util/crypto-hash'

export default class Blockchain {
  chain: Array<Block>

  constructor() {
    this.chain = [Block.genesis()]
  }

  addBlock(data: Array<String>) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length-1],
      data
    })

    this.chain.push(newBlock)
  }

  isValidChain(chain: Array<Block>) {
    if(JSON.stringify(this.chain[0]) !== JSON.stringify(Block.genesis())) {
      return false
    }

    for (let i=1; i<chain.length; i++) {
      const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i]
      const actualLastHash = chain[i-1].hash
      const lastDifficulty = chain[i-1].difficulty

      if(lastHash !== actualLastHash) return false

      const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty)

      if(hash !== validatedHash) return false

      if(Math.abs(Number(lastDifficulty) - Number(difficulty)) > 1) return false
    }

    return true
  }

  replaceChain(chain: Array<Block>) {
    if (chain.length <= this.chain.length) {
      console.error('The incoming chain must be longer')
      return
    }

    if (!this.isValidChain(chain)) {
      console.error('The incoming chain must be valid')
      return
    }

    console.log('replacing chain with ', chain)
    this.chain = chain
  }
}