import Block from "./block"
import { GENESIS_DATA, MINE_RATE } from "../config"
import { cryptoHash } from "../util/crypto-hash"
//@ts-ignore 
import hexToBinary from 'hex-to-binary'

describe('Block', () => {
  const timestamp = 2000
  const lastHash = 'foo-dash'
  const hash = 'bar-hash'
  const data = ['blockchain', 'data']
  const nonce = 1
  const difficulty = 1
  const block = new Block({
    timestamp,
    lastHash,
    data,
    hash, 
    nonce, 
    difficulty
  })

  it('has a timestamp, lastHash, data and hash property', () => {
    expect(block.timestamp).toEqual(timestamp)
    expect(block.lastHash).toEqual(lastHash)
    expect(block.data).toEqual(data)
    expect(block.hash).toEqual(hash)
    expect(block.nonce).toEqual(nonce)
    expect(block.difficulty).toEqual(difficulty)
  })

  describe('genesis()', () => {
    const genesisBlock = Block.genesis()

    it('returns a Block instance', () => {
      expect(genesisBlock instanceof Block).toBe(true)
    })

    it('returns the genesis data', () => {
      expect(genesisBlock).toEqual(GENESIS_DATA)
    })
  })

  describe('mineBlock()', () => {
    const lastBlock = Block.genesis()
    const data = ['mined data']
    const minedBlock = Block.mineBlock({ lastBlock, data })
    
    it('returns a Block instance', () => {
      expect(minedBlock instanceof Block).toBe(true)
    })

    it('sets the `lastHash` to be the `hash` of the lastBlock', () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash)
    })

    it('sets the `data`', () => {
      expect(minedBlock.data).toEqual(data)
    })

    it('sets a `timestamp`', () => {
      expect(minedBlock.timestamp).not.toEqual(undefined)
    })

    it('creates a SHA-256 `hash` based on the proper inputs', () => {
      expect(minedBlock.hash)
        .toEqual(cryptoHash(minedBlock.timestamp, minedBlock.nonce, minedBlock.difficulty, lastBlock.hash, data))
    })

    it('sets a `hash` that matches the difficulty criteria', () => {
      expect(hexToBinary(minedBlock.hash).substring(0, Number(minedBlock.difficulty)))
        .toEqual('0'.repeat(Number(minedBlock.difficulty)))
    })

    it('adjusts the difficulty', () => {
      const possibleResults = [Number(lastBlock.difficulty)+1, Number(lastBlock.difficulty)-1]

      expect(possibleResults.includes(Number(minedBlock.difficulty))).toBe(true)
    })
  })

  describe('adjustDifficulty()', () => {
    it('raises the difficulty for a quickly mined block', () => {
      expect(Block.adjustDifficulty(
        block, Number(block.timestamp) + MINE_RATE - 100
      )).toEqual(Number(block.difficulty) + 1)
    })

    it('lowers the difficulty for a quickly mined block', () => {
      expect(Block.adjustDifficulty(
        block, Number(block.timestamp) + MINE_RATE + 100
      )).toEqual(Number(block.difficulty) - 1)
    })

    it('has a lower limit of 1', () => {
      block.difficulty = -1

      expect(Block.adjustDifficulty(block, 11)).toEqual(1)
    })
  })
})