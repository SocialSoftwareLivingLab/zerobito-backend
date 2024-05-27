import { OcorrenciaEntity } from '@/app/ocorrencias/entities/ocorrencias.entity';

export interface AdicionarOcorrenciaAoCasoUseCaseInput {
  caso: number;
  ocorrencia: OcorrenciaEntity;
}
