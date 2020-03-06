import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller

  constructor (controller: Controller) {
    this.controller = controller
  }

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(req)
    return response
  }
}
