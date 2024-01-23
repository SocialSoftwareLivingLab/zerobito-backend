import { Request, Response } from "express";
import { GettOcorrenciaService } from "../../services/OcorrenciaServices/GettOcorrenciaService";

export class GettOcorrenciaController{
    async handle(request:Request,response:Response){
        const {id} = request.params;

        const service = new GettOcorrenciaService();

        const ocorrencia = await service.execute(id);

        return response.json(ocorrencia);
    }
}