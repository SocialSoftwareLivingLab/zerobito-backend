import { Request , Response } from "express";
import { UpdateUsuarioService } from "../services/UpdateUsuarioService";

export class UpdateUsuarioController{
    async handle(request: Request, response: Response){
        const {id} = request.params
        const {nome , email , senha} = request.body;
        
        const service = new UpdateUsuarioService();
        
        const result = await service.execute(id , nome , email , senha);

        if(result instanceof Error){
            return response.status(400).json(result.message);
        }



        return response.json(result);
    }
}