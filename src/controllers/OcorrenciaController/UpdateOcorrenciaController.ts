import { Request, Response } from "express";
import { UpdateOcorrenciaService } from "../../services/OcorrenciaServices/UpdateOcorrenciaService";

export class UpdateOcorrenciaController {
    async handle(request: Request, response: Response) {
        const { id } = request.params;
        const { condicao, gravidade, status } = request.body;

        const service = new UpdateOcorrenciaService();

        const result = await service.execute({ id, condicao, gravidade, status });

        if (result instanceof Error) {
            return response.status(400).json(result.message);
        }
    }
}
