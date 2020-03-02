export class SignUpController {
  handle (req: any): any {
    return {
      statusCode: 400,
      body: new Error('missing param: name')
    }
  }
}
