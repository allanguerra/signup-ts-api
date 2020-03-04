import { DbStoreAccount } from './db-store-account'
import { Encrypter, StoreAccountRepository, StoreAccountModel } from './db-store-account-protocols'
import { AccountModel } from '../../../domain/models/account.model'

interface SutTypes {
  sut: DbStoreAccount
  encrypterStub: Encrypter
  storeAccountRepositoryStub: StoreAccountRepository
}

const makeStoreAccountRepository = (): StoreAccountRepository => {
  class StoreAccountRepositoryStub implements StoreAccountRepository {
    async store (account: StoreAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'hashed_password'
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new StoreAccountRepositoryStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

const makeSUT = (): SutTypes => {
  const storeAccountRepositoryStub = makeStoreAccountRepository()
  const encrypterStub = makeEncrypter()
  const sut = new DbStoreAccount(encrypterStub, storeAccountRepositoryStub)
  return {
    sut,
    encrypterStub,
    storeAccountRepositoryStub
  }
}

describe('DbStoreAccount UseCase', () => {
  test('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSUT()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'p@ssW0rd'
    }
    await sut.store(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('p@ssW0rd')
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSUT()
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'p@ssW0rd'
    }
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValue(new Error())
    const promise = sut.store(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('should call StoreAccountRepository with correct data', async () => {
    const { sut, storeAccountRepositoryStub } = makeSUT()
    const storeSpy = jest.spyOn(storeAccountRepositoryStub, 'store')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'p@ssW0rd'
    }
    await sut.store(accountData)
    expect(storeSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('should throw if StoreAccountRepository throws', async () => {
    const { sut, storeAccountRepositoryStub } = makeSUT()
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'p@ssW0rd'
    }
    jest.spyOn(storeAccountRepositoryStub, 'store').mockRejectedValue(new Error())
    const promise = sut.store(accountData)
    await expect(promise).rejects.toThrow()
  })
})
