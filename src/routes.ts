import { Router } from 'express'

import loginRouter from './routes/login.routes'
import ocorrenciasRouter from './routes/ocorrencias.routes'
import usersRouter from './routes/users.routes'

const routes = Router()

/**
 * Define todas as rotas da aplicação
 */

routes.use(loginRouter)
routes.use(usersRouter)
routes.use(ocorrenciasRouter)

export { routes }
