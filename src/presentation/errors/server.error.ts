export class ServerError extends Error {
  constructor (stack: string) {
    super('Sorry, something went wrong')
    this.stack = stack
  }
}
