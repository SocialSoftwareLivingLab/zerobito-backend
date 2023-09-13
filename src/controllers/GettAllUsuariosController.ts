import { Request, Response } from "express";
import { GetallUsuariosService } from "../services/GettAllUsuariosService";

export class GetallUsuariosController{
    async handle(request:Request,response:Response){
        const service = new GetallUsuariosService();

        const usuarios = await service.execute();

        return response.json(usuarios);
    }
}