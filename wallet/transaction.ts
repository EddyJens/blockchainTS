import { v1 as uuid } from 'uuid'
import Wallet from '.'
import { verifySignature } from '../util'

interface OutputMapObject {
  recipient?: String,
  senderWallet?: Wallet,
  amount?: number
}

export default class Transaction {
  id: String
  outputMap: OutputMapObject
  input: any

  constructor(senderWallet: Wallet, recipient: String, amount: number) {
    this.id = uuid()
    this.outputMap = this.createOutputmap(senderWallet, recipient, amount)
    this.input = this.createInput(senderWallet, this.outputMap)
  }

  createOutputmap(senderWallet: Wallet, recipient: String, amount: number) {
    let outputMap: OutputMapObject = {}

    outputMap.recipient = String(amount)
    outputMap.senderWallet!.publicKey = String(senderWallet.balance - amount)

    return outputMap
  }

  createInput(senderWallet: Wallet, outputMap: OutputMapObject) {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(String(outputMap))
    }
  }

  static validTransaction(transaction: Transaction) {
    const { input: { address, amount, signature }, outputMap } = transaction

    const outputTotal = Object.values(outputMap)
      .reduce((total: number, outputAmount: number) => total + outputAmount)

    if (amount !== outputTotal) {
      console.error(`Invalid transaction from ${address}`)
      return false
    }

    if (!verifySignature(address, String(outputMap), signature)) {
      console.error(`Invalid signature from ${address}`)
      return false
    }

    return true
  }
}