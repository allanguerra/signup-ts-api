import { MongoHelper } from '../helpers/mongo.helper'
import { Collection } from 'mongodb'
import { MongoLogRepository } from './log'

describe('MongoDB LogRepository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  interface SutTypes {
    sut: MongoLogRepository
  }

  const makeSUT = (): SutTypes => {
    const sut = new MongoLogRepository()
    return {
      sut
    }
  }

  test('should create an error log on success', async () => {
    const { sut } = makeSUT()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
