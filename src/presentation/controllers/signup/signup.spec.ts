import { SignUpController } from './signup.controller'
import { EmailValidator, AccountModel, StoreAccountModel, StoreAccount } from './signup-protocols'
import { MissingParamError, ServerError, InvalidParamError } from '../../errors'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  storeAccountStub: StoreAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeStoreAccount = (): StoreAccount => {
  class StoreAccountStub implements StoreAccount {
    async store (account: StoreAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'p@ssW0rd'
      }

      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new StoreAccountStub()
}

const makeSUT = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const storeAccountStub = makeStoreAccount()
  const sut = new SignUpController(emailValidatorStub, storeAccountStub)

  return {
    sut,
    emailValidatorStub,
    storeAccountStub
  }
}

describe('SignUpController', () => {
  describe('Params validation', () => {
    test('should return 400 if no name is provided', async () => {
      // sut == 'System Under Test' - name pattern to difer class under test from others
      const { sut } = makeSUT()
      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'p@ssW0rd'
        }
      }
      const response = await sut.handle(httpRequest)

      expect(response).toHaveProperty('statusCode')
      expect(response.statusCode).toBe(400)
      expect(response).toHaveProperty('body')
      expect(response.body).toEqual(new MissingParamError('name'))
    })

    test('should return 400 if no email is provided', async () => {
      const { sut } = makeSUT()
      const httpRequest = {
        body: {
          name: 'any name',
          password: 'p@ssW0rd'
        }
      }
      const response = await sut.handle(httpRequest)

      expect(response).toHaveProperty('statusCode')
      expect(response.statusCode).toBe(400)
      expect(response).toHaveProperty('body')
      expect(response.body).toEqual(new MissingParamError('email'))
    })

    test('should return 400 if no password is provided', async () => {
      const { sut } = makeSUT()
      const httpRequest = {
        body: {
          name: 'any name',
          email: 'any_email@mail.com'
        }
      }
      const response = await sut.handle(httpRequest)

      expect(response).toHaveProperty('statusCode')
      expect(response.statusCode).toBe(400)
      expect(response).toHaveProperty('body')
      expect(response.body).toEqual(new MissingParamError('password'))
    })
  })

  describe('EmailValidator scope', () => {
    test('should return 400 if an invalid email is provided', async () => {
      const { sut, emailValidatorStub } = makeSUT()
      jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
      const httpRequest = {
        body: {
          name: 'any name',
          email: 'invalid_email@mail.com',
          password: 'p@ssW0rd'
        }
      }
      const response = await sut.handle(httpRequest)

      expect(response).toHaveProperty('statusCode')
      expect(response.statusCode).toBe(400)
      expect(response).toHaveProperty('body')
      expect(response.body).toEqual(new InvalidParamError('email'))
    })

    test('should call EmailValidator with correct email', async () => {
      const { sut, emailValidatorStub } = makeSUT()
      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
      const httpRequest = {
        body: {
          name: 'any name',
          email: 'any_email@mail.com',
          password: 'p@ssW0rd'
        }
      }
      await sut.handle(httpRequest)
      expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
    })

    test('should return 500 if EmailValidator throws', async () => {
      const { sut, emailValidatorStub } = makeSUT()
      jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
      const httpRequest = {
        body: {
          name: 'any name',
          email: 'any_email@mail.com',
          password: 'p@ssW0rd'
        }
      }
      const response = await sut.handle(httpRequest)

      expect(response).toHaveProperty('statusCode')
      expect(response.statusCode).toBe(500)
      expect(response).toHaveProperty('body')
      expect(response.body).toEqual(new ServerError())
    })
  })

  describe('SotoreAccount scope', () => {
    test('should call StoreAccount with correct values', async () => {
      const { sut, storeAccountStub } = makeSUT()
      const storeSpy = jest.spyOn(storeAccountStub, 'store')
      const httpRequest = {
        body: {
          name: 'any name',
          email: 'any_email@mail.com',
          password: 'p@ssW0rd'
        }
      }
      await sut.handle(httpRequest)
      expect(storeSpy).toHaveBeenCalledWith({
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'p@ssW0rd'
      })
    })

    test('should return 500 if StoreAccount throws', async () => {
      const { sut, storeAccountStub } = makeSUT()
      jest.spyOn(storeAccountStub, 'store').mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })
      const httpRequest = {
        body: {
          name: 'any name',
          email: 'any_email@mail.com',
          password: 'p@ssW0rd'
        }
      }
      const response = await sut.handle(httpRequest)

      expect(response).toHaveProperty('statusCode')
      expect(response.statusCode).toBe(500)
      expect(response).toHaveProperty('body')
      expect(response.body).toEqual(new ServerError())
    })

    test('should return 200 if valid data is provided', async () => {
      const { sut } = makeSUT()
      const httpRequest = {
        body: {
          name: 'any name',
          email: 'any_email@mail.com',
          password: 'p@ssW0rd'
        }
      }
      const response = await sut.handle(httpRequest)

      expect(response).toHaveProperty('statusCode')
      expect(response.statusCode).toBe(200)
      expect(response).toHaveProperty('body')
      expect(response.body).toEqual({
        id: 'valid_id',
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'p@ssW0rd'
      })
    })
  })
})
