import { HttpResponse, HttpRequest } from '../protocols/http.protocol'
import { MissingParamError } from '../errors/missing-param.error'
import { BadRequest } from '../helpers/http.helper'

export class SignUpController {
  handle (req: HttpRequest): HttpResponse {
    if (!req.body.name) {
      return BadRequest(new MissingParamError('name'))
    }
    if (!req.body.email) {
      return BadRequest(new MissingParamError('email'))
    }
  }
}
