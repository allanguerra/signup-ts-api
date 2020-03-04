import { DbStoreAccount } from './db-store-account'

describe('DbStoreAccount UseCase', () => {
  test('should call Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return new Promise(resolve => resolve('hashed_password'))
      }
    }
    const encrypterStub = new EncrypterStub()
    const sut = new DbStoreAccount(encrypterStub)
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
