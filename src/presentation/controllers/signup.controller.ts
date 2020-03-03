import { HttpResponse, HttpRequest } from '../protocols/http.protocol'
import { MissingParamError } from '../errors/missing-param.error'
import { BadRequest } from '../helpers/http.helper'

export class SignUpController {
  handle (req: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password']
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return BadRequest(new MissingParamError(field))
      }
    }
  }
}
