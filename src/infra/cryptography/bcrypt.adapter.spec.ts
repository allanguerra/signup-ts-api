import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt.adapter'

jest.mock('bcrypt', () => ({
  async hash (value: string): Promise<string> {
    return new Promise(resolve => resolve('hashed_value'))
  }
}))

describe('BCrypt Adapter', () => {
  test('should call bcrypt with correct value', async () => {
    const salt = 12
    const sut = new BCryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('should return a hash on success', async () => {
    const salt = 12
    const sut = new BCryptAdapter(salt)
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hashed_value')
  })
})
