import { getRepository } from "typeorm";
import { Usuario } from "../entities/Usuario";

export class DeleteUsuarioService{
    async execute(id: string){
        const repo = getRepository(Usuario);
    
        if(!(await repo.findOne({id}))){
           
            return new Error ("Usuário não encontrado");

        }
        
        await repo.delete(id);
    }

}