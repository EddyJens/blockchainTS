const EC = require('elliptic').ec
import { cryptoHash } from "./crypto-hash"

export const ec = new EC('secp256k1')

export const verifySignature = (publicKey: String, data: String, signature: String) => {
  const keyFromPublic = ec.keyFromPublic(publicKey, 'hex')

  return keyFromPublic.verify(cryptoHash(data), signature)
}