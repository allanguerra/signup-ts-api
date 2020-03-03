import { AccountModel } from '../models/account.model'

export interface StoreAccountModel {
  name: string
  email: string
  password: string
}

export interface StoreAccount {
  store (account: StoreAccountModel): Promise<AccountModel>
}
