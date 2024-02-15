import { Router } from 'express'
import { CreateUsuarioController } from './controllers/UsuarioController/CreateUsuarioController'
import { GetAllUsuariosController } from './controllers/UsuarioController/GettAllUsuariosController'
import { DeleteUsuarioController } from './controllers/UsuarioController/DeleteUsuarioController'
import { UpdateDateColumn } from 'typeorm'
import { UpdateUsuarioController } from './controllers/UsuarioController/UpdateUsuarioController'
import loginController from './controllers/UsuarioController/LoginController'
import { CreateOcorrenciaController } from './controllers/OcorrenciaController/CreateOcorrenciaController'
import { GettOcorrenciaController } from './controllers/OcorrenciaController/GettOcorrenciaController'
import { GetAllOcorrenciaController } from './controllers/OcorrenciaController/GetAllOcorrenciaController'
import { DeleteOcorrenciaController } from './controllers/OcorrenciaController/DeleteOcorrenciaController'
import { UpdateOcorrenciaController } from './controllers/OcorrenciaController/UpdateOcorrenciaController'

import {
    UserIsAuthenticated,
    UserIsAdmin,
} from './middlewares/UserAuthenticated'

const routes = Router()

//CRUD USUARIO
routes.post('/login', loginController)
routes.post('/register', new CreateUsuarioController().handle)

// Apenas usuários autenticados podem listar todos os usuários
routes.get('/users', UserIsAuthenticated, new GetAllUsuariosController().handle)

// Apenas administradores podem deletar ou atualizar usuários
routes.delete(
    '/users/:id',
    UserIsAuthenticated,
    UserIsAdmin,
    new DeleteUsuarioController().handle
)
routes.put(
    '/users/:id',
    UserIsAuthenticated,
    UserIsAdmin,
    new UpdateUsuarioController().handle
)

//CRUD OCORRENCIA
routes.post('/ocorrencias', new CreateOcorrenciaController().handle)
routes.get('/ocorrencias/:id', new GettOcorrenciaController().handle)
routes.get('/ocorrencias', new GetAllOcorrenciaController().handle)
routes.delete('/ocorrencias/:id', new DeleteOcorrenciaController().handle)
routes.put('/ocorrencias/:id', new UpdateOcorrenciaController().handle)

export { routes }
