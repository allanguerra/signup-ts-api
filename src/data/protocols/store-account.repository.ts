import { AccountModel } from '../../domain/models/account.model'
import { StoreAccountModel } from '../../domain/use-cases/store-account'

export interface StoreAccountRepository {
  store (account: StoreAccountModel): Promise<AccountModel>
}
