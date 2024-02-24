import { Request, Response } from 'express'
import { GetAllUsuariosService } from '../../services/UsuarioServices/GettAllUsuariosService'

export class GetAllUsuariosController {
  async handle(request: Request, response: Response) {
    const service = new GetAllUsuariosService()

    try {
      const usuarios = await service.execute()
      return response.json(usuarios)
    } catch (error) {
      // Aqui você pode logar o erro ou tratar de forma específica se necessário
      console.error('Erro ao obter usuários:', error)

      // Enviar uma resposta genérica de erro
      return response.status(500).json({ message: 'Erro interno do servidor' })
    }
  }
}
