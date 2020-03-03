import { AccountModel } from '../models'

export interface StoreAccountModel {
  name: string
  email: string
  password: string
}

export interface StoreAccount {
  store (account: StoreAccountModel): AccountModel
}
