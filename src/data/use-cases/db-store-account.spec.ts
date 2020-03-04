import { DbStoreAccount } from './db-store-account'
import { Encrypter } from '../protocols/encrypter.protocol'

interface SutTypes {
  sut: DbStoreAccount
  encrypterStub: Encrypter
}

const makeSUT = (): SutTypes => {
  class EncrypterStub {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  const encrypterStub = new EncrypterStub()
  const sut = new DbStoreAccount(encrypterStub)
  return {
    sut,
    encrypterStub
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
})
