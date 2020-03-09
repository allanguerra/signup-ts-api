import { HttpResponse, HttpRequest, Controller, EmailValidator, StoreAccount } from './signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http.helper'

export class SignUpController implements Controller {
  private readonly emailValidator
  private readonly storeAccount

  constructor (emailValidator: EmailValidator, storeAccount: StoreAccount) {
    this.emailValidator = emailValidator
    this.storeAccount = storeAccount
  }

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password']
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password } = req.body

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.storeAccount.store({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
