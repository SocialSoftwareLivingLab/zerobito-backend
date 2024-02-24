import { CreateUsuarioService } from '../../services/UsuarioServices/CreateUsuarioService'
import { Request, Response } from 'express'

export class CreateUsuarioController {
  async handle(request: Request, response: Response) {
    const { nome, email, senha, role } = request.body
    const service = new CreateUsuarioService()

    try {
      // Execute o serviço e aguarde a criação do usuário
      const usuario = await service.execute({ nome, email, senha, role })

      // Retorna o objeto do usuário criado, incluindo o id
      return response.json(usuario)
    } catch (error) {
      // Em caso de erro, retorne uma resposta de erro
      return response.status(400).json({ error: error.message })
    }
  }
}
