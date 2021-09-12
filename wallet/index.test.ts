import Wallet from '.'
import { verifySignature } from '../util'

describe('Wallet', () => {
  let wallet: Wallet

  beforeEach(() => {
    wallet = new Wallet()
  })

  it('has a `balance`', () => {
    expect(wallet).toHaveProperty('balance')
  })

  it('has a `publicKey`', () => {
    expect(wallet).toHaveProperty('publicKey')
  })

  describe('signing data', () => {
    const data = 'foobar'

    it('verifies a signature', () => {
      expect(
        verifySignature(
          wallet.publicKey,
          data,
          wallet.sign(data)
        )
      ).toBe(true)
    })

    it('does not verify an invalid signature', () => {
      expect(
        verifySignature(
          wallet.publicKey,
          data,
          new Wallet().sign(data)
        )
      ).toBe(false)
    })
  })
})