import { SignUpController } from './signup.controller'

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
  })
})
