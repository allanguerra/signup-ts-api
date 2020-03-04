import { StoreAccount, StoreAccountModel, AccountModel, Encrypter } from './db-store-account-protocols'

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
