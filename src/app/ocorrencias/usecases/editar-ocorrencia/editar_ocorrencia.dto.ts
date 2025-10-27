import { AtualizarOcorrenciaRequest } from "../../payloads/editar-ocorrencia.dto";

export interface AtualizarOcorrenciaUseCaseRequest {
  id: number;
  dadosAtualizacao: AtualizarOcorrenciaRequest;
}