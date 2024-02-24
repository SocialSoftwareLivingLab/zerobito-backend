import { Router } from 'express'
import { CreateUsuarioController } from '../controllers/UsuarioController/CreateUsuarioController'
import loginController from '../controllers/UsuarioController/LoginController'

const loginRouter = Router()

loginRouter.post('/login', loginController)
loginRouter.post('/register', new CreateUsuarioController().handle)

export default loginRouter
