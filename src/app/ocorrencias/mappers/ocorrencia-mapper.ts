import { OcorrenciaDto } from '../payloads/ocorrencia.dto';
import { OcorrenciaEntity } from '../entities/ocorrencias.entity';
import { CondicaoVitimaOcorrenciaEnum } from '../enums/condicao-vitima-ocorrencia.enum';
import { StatusOcorrenciaEnum } from '../enums/status-ocorrencia.enum';

export function entityToOcorrenciaResponse(entity: OcorrenciaEntity) {
  const resultado = new OcorrenciaDto();
  resultado.data = entity.data;
  resultado.descricao = entity.descricao;
  resultado.empresa = entity.empresa;
  resultado.fonte = entity.fonte;
  resultado.id = entity.id;
  resultado.local = entity.local;
  resultado.relator = {
    id: entity.relator.id,
    nome: entity.relator.nome,
    email: entity.relator.email,
  };
  resultado.status = {
    descricao: entity.status.descricao,
    sigla: StatusOcorrenciaEnum[entity.status.sigla],
  };
  resultado.vitima = {
    condicao: CondicaoVitimaOcorrenciaEnum[entity.vitima.condicao.sigla],
    nome: entity.vitima.nome,
    vinculo: entity.vitima.vinculo,
  };
  resultado.dataAlteracao = entity.dataAlteracao;
  return resultado;
}
