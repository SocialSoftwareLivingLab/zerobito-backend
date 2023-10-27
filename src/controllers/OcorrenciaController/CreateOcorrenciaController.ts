import { Request, Response } from 'express';
import  {CreateOcorrenciaService}  from "../../services/OcorrenciaServices/CreateOcorrenciaService";

export class CreateOcorrenciaController {
    async handle(request: Request, response: Response) {
        const{denuncia, local, data, condicao, gravidade, status} = request.body;

        const service = new CreateOcorrenciaService();
 
        const result = await service.execute({denuncia,local, data, condicao, gravidade, status});

        try {
            const result = await service.execute({denuncia,local,data, condicao, gravidade, status });
            return response.status(201).json(result); // Status 201 indica criação bem-sucedida
        } catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}
