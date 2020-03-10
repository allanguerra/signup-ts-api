import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogErrorRepository } from '../../data/protocols/log-error.repository'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRepository: LogErrorRepository

  constructor (controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(req)
    if (response.statusCode === 500) {
      await this.logErrorRepository.logError(response.body.stack)
    }
    return response
  }
}
