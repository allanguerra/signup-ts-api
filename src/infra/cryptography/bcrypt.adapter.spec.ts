import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt.adapter'

const salt = 12

const makeSUT = (): BCryptAdapter => {
  return new BCryptAdapter(salt)
}

jest.mock('bcrypt', () => ({
  async hash (value: string): Promise<string> {
    return new Promise(resolve => resolve('hashed_value'))
  }
}))

describe('BCrypt Adapter', () => {
  test('should call bcrypt with correct value', async () => {
    const sut = makeSUT()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('should return a hash on success', async () => {
    const sut = makeSUT()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hashed_value')
  })

  test('should throw if bcrypt throws', async () => {
    const sut = makeSUT()
    jest.spyOn(bcrypt, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.encrypt('any_value')
    await expect(promise).rejects.toThrow()
  })
})
