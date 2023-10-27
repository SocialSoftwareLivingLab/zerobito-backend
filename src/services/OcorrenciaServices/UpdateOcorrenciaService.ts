import { getRepository } from "typeorm";
import { Ocorrencia } from "../../entities/Ocorrencia";



type OcorrenciaRequest = {
    id: string;
    condicao: string;
    gravidade: string;
    status: string;
};

export class UpdateOcorrenciaService {
    async execute({id,condicao, gravidade, status}: OcorrenciaRequest) : Promise<Ocorrencia | Error>{
        const repo = getRepository(Ocorrencia);

        const ocorrencia = await repo.findOne(id);

        if(!ocorrencia){
            return new Error("Ocorrência não encontrada");
        }

        ocorrencia.condicao = condicao ? condicao : ocorrencia.condicao;
        ocorrencia.gravidade = gravidade ? gravidade : ocorrencia.gravidade;
        ocorrencia.status = status ? status : ocorrencia.status;

        await repo.save(ocorrencia);

        return ocorrencia;
    
    }
}