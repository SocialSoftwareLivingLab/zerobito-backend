import { getCustomRepository } from "typeorm";
import { Ocorrencia } from "../../entities/Ocorrencia";
import OcorrenciaRepository from "../../repositories/OcorrenciaRepositorie";
import { CondicaoAcidentado } from "../../enums/CondicaoAcidantadoEnum";
import { Gravidade } from "../../enums/GravidadeEnum";
import { Status } from "../../enums/OcorrenciaEnum";

type OcorrenciaRequest = {
  denuncia: string;
  local: string;
  data: Date;
  nomeVitima: string;
  tipoOcorrencia: string;
  nomeContato: string;
  emailContato: string;
  telefoneContato: string;
  condicaoAcidentado: CondicaoAcidentado;
  nomeEmpresaEmpregadora: string;
  gravidade: Gravidade;
  status: Status;
};

export class CreateOcorrenciaService {
  async execute({
    denuncia,
    local,
    data,
    nomeVitima,
    tipoOcorrencia,
    nomeContato,
    emailContato,
    telefoneContato,
    condicaoAcidentado,
    nomeEmpresaEmpregadora,
    gravidade,
    status,
  }: OcorrenciaRequest): Promise<Ocorrencia | Error> {
    const repo = getCustomRepository(OcorrenciaRepository);

    try {
      const ocorrencias = repo.create({
        denuncia,
        local,
        data,
        nomeVitima,
        tipoOcorrencia,
        nomeContato,
        emailContato,
        telefoneContato,
        condicaoAcidentado,
        nomeEmpresaEmpregadora,
        gravidade,
        status,
      });

      await repo.save(ocorrencias);
      return ocorrencias;
    } catch (error) {
      console.log(error);
      return new Error("Não foi possível salvar a ocorrência.");
    }
  }
}