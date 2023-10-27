import { getRepository } from "typeorm";
import { Ocorrencia } from "../../entities/Ocorrencia";


export class GettOcorrenciaService{
    async execute(id: string){
        const repo = getRepository(Ocorrencia);
        const ocorrencia = await repo.findOne(id);

        if(!ocorrencia){
            return new Error ("Ocorrência não encontrada");
        }

        return ocorrencia;
    }
}