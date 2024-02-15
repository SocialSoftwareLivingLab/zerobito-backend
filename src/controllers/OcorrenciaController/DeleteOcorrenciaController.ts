import { Request, Response } from 'express'
import { DeleteOcorrenciaService } from '../../services/OcorrenciaServices/DeleteOcorrenciaService'

export class DeleteOcorrenciaController {
    async handle(request: Request, response: Response) {
        const { id } = request.params

        const service = new DeleteOcorrenciaService()

        const result = await service.execute(id)

        if (result instanceof Error) {
            return response.status(400).json(result.message)
        }

        return response.status(204).end()
    }
}
