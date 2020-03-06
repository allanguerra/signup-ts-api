import { SignUpController } from '../../presentation/controllers/signup/signup.controller'
import { EmailValidatorAdapter } from '../../utils/email-validator.adapter'
import { DbStoreAccount } from '../../data/use-cases/add-account/db-store-account'
import { BCryptAdapter } from '../../infra/cryptography/bcrypt.adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const encrypter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const emailValidator = new EmailValidatorAdapter()
  const dbStoreAccount = new DbStoreAccount(encrypter, accountMongoRepository)
  return new SignUpController(emailValidator, dbStoreAccount)
}
