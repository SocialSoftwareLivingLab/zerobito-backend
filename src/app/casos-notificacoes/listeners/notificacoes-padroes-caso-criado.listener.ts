import {
  CasoCriadoEvent,
  CasoCriadoEventKey,
} from '@/app/casos/events/caso-criado.event';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CasosNotificacoesService } from '../casos-notificacoes.service';
import { CriarNotificacaoRequest } from '../payloads/nova-notificacao.payload';

@Injectable()
export default class CriarNotificacoesPadraoParaCasoCriadoListener {

  private readonly logger = new Logger(CriarNotificacoesPadraoParaCasoCriadoListener.name);

  constructor(
    private readonly casosNotificacoesService: CasosNotificacoesService,
  ) {}

  @OnEvent(CasoCriadoEventKey)
  public async registrar(payload: CasoCriadoEvent) {
    const { id: idCasoCriado, criador } = payload;

    this.logger.log(`Registrando notificações padrões ao caso ${idCasoCriado}`);

    const tiposNotificacoes =
      await this.casosNotificacoesService.buscarTiposNotificacoes();

    // Crie uma notificação para cada tipo
    for (const tipo of tiposNotificacoes) {
      const notificacaoRequest: CriarNotificacaoRequest = {
        tipo: tipo.nome,
        identificador: '',
        isEmitida: false,
        statusNotificacao: 'Aguardando',
        dataEmissao: null,
        observacao: '',
      };

      await this.casosNotificacoesService.adicionarNotificacao(
        idCasoCriado,
        notificacaoRequest,
        criador,
      );
    }
  }
}
