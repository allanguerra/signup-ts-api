import { Controller } from '../../presentation/protocols'
import { SignUpController } from '../../presentation/controllers/signup/signup.controller'
import { EmailValidatorAdapter } from '../../utils/email-validator.adapter'
import { DbStoreAccount } from '../../data/use-cases/add-account/db-store-account'
import { BCryptAdapter } from '../../infra/cryptography/bcrypt.adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { MongoLogRepository } from '../../infra/db/mongodb/log-repository/log'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const encrypter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const emailValidator = new EmailValidatorAdapter()
  const mogoLogRepository = new MongoLogRepository()
  const dbStoreAccount = new DbStoreAccount(encrypter, accountMongoRepository)
  const signupController = new SignUpController(emailValidator, dbStoreAccount)
  return new LogControllerDecorator(signupController, mogoLogRepository)
}
