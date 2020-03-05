import { Express, Router } from 'express'
import fs from 'fast-glob'

export default (app: Express): void => {
  const router = Router()
  app.use('/v1', router)

  fs
    .sync('**/src/main/routes/**-routes.ts')
    .map(async file => (await import(`../../../${file}`)).default(router))
}
