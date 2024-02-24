import { Router } from 'express'
import { CreateOcorrenciaController } from '../controllers/OcorrenciaController/CreateOcorrenciaController'
import { GettOcorrenciaController } from '../controllers/OcorrenciaController/GettOcorrenciaController'
import { GetAllOcorrenciaController } from '../controllers/OcorrenciaController/GetAllOcorrenciaController'
import { DeleteOcorrenciaController } from '../controllers/OcorrenciaController/DeleteOcorrenciaController'
import { UpdateOcorrenciaController } from '../controllers/OcorrenciaController/UpdateOcorrenciaController'

const ocorrenciasRouter = Router()

ocorrenciasRouter.post('/ocorrencias', new CreateOcorrenciaController().handle)
ocorrenciasRouter.get('/ocorrencias/:id', new GettOcorrenciaController().handle)
ocorrenciasRouter.get('/ocorrencias', new GetAllOcorrenciaController().handle)
ocorrenciasRouter.delete(
  '/ocorrencias/:id',
  new DeleteOcorrenciaController().handle,
)
ocorrenciasRouter.put(
  '/ocorrencias/:id',
  new UpdateOcorrenciaController().handle,
)

export default ocorrenciasRouter
