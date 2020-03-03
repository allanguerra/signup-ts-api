import { SignUpController } from './signup.controller'
import { MissingParamError } from '../errors/missing-param.error'

describe('SignUpController', () => {
  test('should return 400 if no name is provided', () => {
    // sut == 'System Under Test' - name pattern to difer class under test from others
    const sut = new SignUpController()
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
    // sut == 'System Under Test' - name pattern to difer class under test from others
    const sut = new SignUpController()
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
    // sut == 'System Under Test' - name pattern to difer class under test from others
    const sut = new SignUpController()
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
})
