import { HttpResponse, HttpRequest } from '../protocols/http.protocol'
import { MissingParamError } from '../errors/missing-param.error'
import { BadRequest } from '../helpers/http.helper'
import { Controller } from '../protocols/controller.protocol'
import { EmailValidator } from '../protocols/email-validator.protocol'
import { InvalidParamError } from '../errors/invalid-param.error'
import { ServerError } from '../errors/server.error'

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
          return BadRequest(new MissingParamError(field))
        }
      }
      if (!this.emailValidator.isValid(req.body.email)) {
        return BadRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}
