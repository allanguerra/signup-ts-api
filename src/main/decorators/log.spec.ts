import { LogControllerDecorator } from './log'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

describe('Log Controller Decorator', () => {
  interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
  }

  const makeControllerStub = (): Controller => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse = {
          statusCode: 200,
          body: {
            id: 'any_id',
            name: 'any_name',
            email: 'any_email@gmail.com',
            password: 'any_password'
          }
        }
        return new Promise(resolve => resolve(httpResponse))
      }
    }
    return new ControllerStub()
  }

  const makeSUT = (): SutTypes => {
    const controllerStub = makeControllerStub()
    const sut = new LogControllerDecorator(controllerStub)
    return {
      sut,
      controllerStub
    }
  }

  test('should call controller handle', async () => {
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }
    const { sut, controllerStub } = makeSUT()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
