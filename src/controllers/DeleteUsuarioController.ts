import {Request , Response} from 'express';
import { DeleteUsuarioService } from '../services/DeleteUsuarioService';

export class DeleteUsuarioController{
    async handle(request: Request, response: Response){
        const {id} = request.params;
        
        const service = new DeleteUsuarioService();
        
        const result = await service.execute(id);

        if(result instanceof Error){
            return response.status(400).json(result.message);
       
        }
       
        return response.status(204).end();
    }
}