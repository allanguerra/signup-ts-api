import { HttpResponse, HttpRequest } from '../protocols/http.protocol'
import { MissingParamError } from '../errors/missing-param.error'
import { BadRequest } from '../helpers/http.helper'
import { Controller } from '../protocols/controller.protocol'

export class SignUpController implements Controller {
  handle (req: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password']
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return BadRequest(new MissingParamError(field))
      }
    }
  }
}
