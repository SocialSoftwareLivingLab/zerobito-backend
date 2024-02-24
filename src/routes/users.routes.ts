import { Router } from 'express'
import {
  UserIsAdmin,
  UserIsAuthenticated,
} from '../middlewares/UserAuthenticated'
import { GetAllUsuariosController } from '../controllers/UsuarioController/GettAllUsuariosController'
import { DeleteUsuarioController } from '../controllers/UsuarioController/DeleteUsuarioController'
import { UpdateUsuarioController } from '../controllers/UsuarioController/UpdateUsuarioController'

const usersRouter = Router()

usersRouter.get(
  '/users',
  UserIsAuthenticated,
  new GetAllUsuariosController().handle,
)

// Apenas administradores podem deletar ou atualizar usuários
usersRouter.delete(
  '/users/:id',
  UserIsAuthenticated,
  UserIsAdmin,
  new DeleteUsuarioController().handle,
)
usersRouter.put(
  '/users/:id',
  UserIsAuthenticated,
  UserIsAdmin,
  new UpdateUsuarioController().handle,
)

export default usersRouter
