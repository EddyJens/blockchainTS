import { STARTING_BALANCE } from "../config";
import { ec } from "../util"
import { cryptoHash } from "../util/crypto-hash";

export default class Wallet {
  balance: number
  publicKey: String
  keyPair: any

  constructor() {
    this.balance = STARTING_BALANCE

    this.keyPair = ec.genKeyPair()
    this.publicKey = this.keyPair.getPublic().encode('hex')
  }

  sign(data: String) {
    return this.keyPair.sign(cryptoHash(data))
  }
}