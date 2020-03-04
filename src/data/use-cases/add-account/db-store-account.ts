import { StoreAccount, StoreAccountModel, AccountModel, Encrypter, StoreAccountRepository } from './db-store-account-protocols'

export class DbStoreAccount implements StoreAccount {
  private readonly encrypter: Encrypter
  private readonly storeAccountRepository: StoreAccountRepository

  constructor (encrypter: Encrypter, storeAccountRepository: StoreAccountRepository) {
    this.encrypter = encrypter
    this.storeAccountRepository = storeAccountRepository
  }

  async store (accountData: StoreAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    await this.storeAccountRepository.store(Object.assign({}, accountData, { password: hashedPassword }))
    return new Promise(resolve => resolve(null))
  }
}
