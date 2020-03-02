export class SignUpController {
  handle (req: any): any {
    if (!req.body.name) {
      return {
        statusCode: 400,
        body: new Error('missing param: name')
      }
    }
    if (!req.body.email) {
      return {
        statusCode: 400,
        body: new Error('missing param: email')
      }
    }
  }
}
