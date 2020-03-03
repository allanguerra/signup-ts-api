import { HttpResponse } from '../protocols/http.protocol'

export const BadRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})
