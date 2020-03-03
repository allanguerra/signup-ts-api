import { SignUpController } from './signup.controller'
import { MissingParamError } from '../errors/missing-param.error'
import { InvalidParamError } from '../errors/invalid-param.error'
import { EmailValidator } from '../protocols/email-validator.protocol'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeSUT = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUpController', () => {
  test('should return 400 if no name is provided', () => {
    // sut == 'System Under Test' - name pattern to difer class under test from others
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'p@ssW0rd'
      }
    }
    const response = sut.handle(httpRequest)
    expect(response).toHaveProperty('statusCode')
    expect(response.statusCode).toBe(400)
    expect(response).toHaveProperty('body')
    expect(response.body).toEqual(new MissingParamError('name'))
  })

  test('should return 400 if no email is provided', () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        name: 'any name',
        password: 'p@ssW0rd'
      }
    }
    const response = sut.handle(httpRequest)
    expect(response).toHaveProperty('statusCode')
    expect(response.statusCode).toBe(400)
    expect(response).toHaveProperty('body')
    expect(response.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no name is provided', () => {
    const { sut } = makeSUT()
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com'
      }
    }
    const response = sut.handle(httpRequest)
    expect(response).toHaveProperty('statusCode')
    expect(response.statusCode).toBe(400)
    expect(response).toHaveProperty('body')
    expect(response.body).toEqual(new MissingParamError('password'))
  })

  test('should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSUT()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'invalid_email@mail.com',
        password: 'p@ssW0rd'
      }
    }
    const response = sut.handle(httpRequest)
    expect(response).toHaveProperty('statusCode')
    expect(response.statusCode).toBe(400)
    expect(response).toHaveProperty('body')
    expect(response.body).toEqual(new InvalidParamError('email'))
  })

  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSUT()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'p@ssW0rd'
      }
    }
    const response = sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
