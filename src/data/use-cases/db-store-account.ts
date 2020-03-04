import { StoreAccount, StoreAccountModel } from '../../domain/use-cases/store-account'
import { AccountModel } from '../../domain/models/account.model'
import { Encrypter } from '../protocols/encrypter.protocol'

export class DbStoreAccount implements StoreAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async store (account: StoreAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return new Promise(resolve => resolve(null))
  }
}
