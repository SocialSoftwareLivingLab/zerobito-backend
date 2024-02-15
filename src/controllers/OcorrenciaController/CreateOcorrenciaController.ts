import { Request, Response } from 'express'
import { CreateOcorrenciaService } from '../../services/OcorrenciaServices/CreateOcorrenciaService'

export class CreateOcorrenciaController {
    async handle(request: Request, response: Response) {
        const {
            denuncia,
            local,
            data,
            nomeVitima,
            tipoOcorrencia,
            nomeContato,
            emailContato,
            telefoneContato,
            condicaoAcidentado,
            nomeEmpresaEmpregadora,
            gravidade,
            status,
        } = request.body

        const service = new CreateOcorrenciaService()

        try {
            const result = await service.execute({
                denuncia,
                local,
                data,
                nomeVitima,
                tipoOcorrencia,
                nomeContato,
                emailContato,
                telefoneContato,
                condicaoAcidentado,
                nomeEmpresaEmpregadora,
                gravidade,
                status,
            })
            return response.status(201).json(result) // <-- Retorna a ocorrência criada, incluindo o "id".
        } catch (error) {
            return response.status(400).json({ error: error.message })
        }
    }
}
