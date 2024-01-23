import { Request, Response } from "express";
import { GetAllOcorrenciaService } from "../../services/OcorrenciaServices/GetAllOcorrenciaServices";

export class GetAllOcorrenciaController{
    async handle(request:Request,response:Response){
        const service = new GetAllOcorrenciaService();

        const ocorrencias = await service.execute();

        return response.json(ocorrencias);
    }
}