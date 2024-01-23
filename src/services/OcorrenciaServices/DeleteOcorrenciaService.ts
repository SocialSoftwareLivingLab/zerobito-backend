import { getRepository } from "typeorm";
import { Ocorrencia } from "../../entities/Ocorrencia";


export class DeleteOcorrenciaService{
    async execute(id: string){
        const repo = getRepository(Ocorrencia);
    
        if(!(await repo.findOne({id}))){
           
            return new Error ("Ocorrência não encontrada");

        }
        
        await repo.delete(id);
    }

} 