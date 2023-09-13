import { CreateUsuarioService } from "../services/CreateUsuarioService";
import {Request,Response} from "express"


export class CreateUsuarioController{

    async handle(request:Request, response:Response){

        const {nome, email, senha} = request.body

        const service = new CreateUsuarioService();

        const result = await service.execute({nome,email,senha});

            if(result instanceof Error){
                
                return response.status(400).json(result.message);

            }
           return response.json(result);
        }

    }