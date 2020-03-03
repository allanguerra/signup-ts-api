import { HttpResponse, HttpRequest } from '../protocols/http.protocol'

export interface Controller {
  handle (req: HttpRequest): Promise<HttpResponse>
}
