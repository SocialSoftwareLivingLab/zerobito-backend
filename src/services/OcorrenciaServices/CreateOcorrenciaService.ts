import { getRepository } from "typeorm";
import { Ocorrencia } from "../../entities/Ocorrencia";


type OcorrenciaRequest = {
    denuncia: string;
    local: string;
    data: Date;
    condicao: string;
    gravidade: string;
    status: string;
  };
  

export class CreateOcorrenciaService {
    async execute({data, condicao, gravidade, status}: OcorrenciaRequest) : Promise<Ocorrencia | Error>{
        const repo = getRepository(Ocorrencia);
    
        //Verificar se o nome já existe
        if(await repo.findOne({data})){
            return new Error("Data já cadastrada");
        }

        const ocorrencia = repo.create({
            data,
            condicao,
            gravidade,
            status
        });

        await repo.save(ocorrencia);
        return ocorrencia;
    }

}