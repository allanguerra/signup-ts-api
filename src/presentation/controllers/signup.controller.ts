import { HttpResponse, HttpRequest } from '../protocols/http.protocol'
import { MissingParamError } from '../errors/missing-param.error'
import { badRequest, serverError } from '../helpers/http.helper'
import { Controller } from '../protocols/controller.protocol'
import { EmailValidator } from '../protocols/email-validator.protocol'
import { InvalidParamError } from '../errors/invalid-param.error'

export class SignUpController implements Controller {
  private readonly emailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (req: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password']
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      if (!this.emailValidator.isValid(req.body.email)) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
