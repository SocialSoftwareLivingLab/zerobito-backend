export interface AtualizarInformacoesBasicasCasoUsecaseRequest {
  id: number;
  dados: {
    comentarios: string;
    causaPrimaria: string;
    causaSecundaria: string;
    diagnostico: string;
  };
}

export default class AtualizarInformacoesBasicasCasoUsecase {
  constructor() {}
}
