import { StoreAccountRepository } from '../../../../data/protocols/store-account.repository'
import { AccountModel } from '../../../../domain/models/account.model'
import { StoreAccountModel } from '../../../../domain/use-cases/store-account'
import { MongoHelper } from '../helpers/mongo.helper'

export class AccountMongoRepository implements StoreAccountRepository {
  async store (accountData: StoreAccountModel): Promise<AccountModel> {
    const accountsCollection = MongoHelper.getCollection('accounts')
    const result = await accountsCollection.insertOne(accountData)
    const account = result.ops[0]
    const { _id, ...accountWithoutId } = account
    return Object.assign({}, accountWithoutId, { id: _id })
  }
}
