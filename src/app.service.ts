import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import OcorrenciaSeeds from './app/ocorrencias/seeds/ocorrencias.seeds';
import CausaSeeds from './app/casos/seeds/causas.seed';
import DiagnosticosSeeds from './app/casos/seeds/diagnosticos.seed';
import TipoNotificacaoSeed from './app/casos-notificacoes/seeds/tipo-notificacao.seed';
import StatusMembroGrupoTrabalhoSeed from './app/casos-grupo-trabalho/seeds/status-membro-grupo.seed';
import SeedRunner from './shared/seeds/seed-runner';
import { EmailService } from './shared/email/email.service';

@Injectable()
export default class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly ocorrenciaSeeds: OcorrenciaSeeds,
    private readonly causasSeeds: CausaSeeds,
    private readonly diagnosticoSeeds: DiagnosticosSeeds,
    private readonly tiposNotificacoesSeeds: TipoNotificacaoSeed,
    private readonly statusMembroGrupoSeeds: StatusMembroGrupoTrabalhoSeed,
    private readonly emailService: EmailService,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('........ Seed das bases de dados: INICIANDO  ........');

    const runners: SeedRunner[] = [
      this.ocorrenciaSeeds,
      this.causasSeeds,
      this.diagnosticoSeeds,
      this.tiposNotificacoesSeeds,
      this.statusMembroGrupoSeeds,
    ];

    runners.forEach((runner) => runner.run());

    this.logger.log('........ Seed das bases de dados: FINALIZADO ........');

    this.logger.log('Testando envio de e-mail');

    this.emailService.enviarTextoPuro({
      assunto: 'Teste de e-mail',
      destinatario: { nome: 'Leonardo Braz', email: 'lhleonardo05@gmail.com' },
      mensagem: 'Esse é um teste',
    });
  }
}
