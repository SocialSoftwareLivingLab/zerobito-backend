import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import OcorrenciaSeeds from './app/ocorrencias/seeds/ocorrencias.seeds';
import CausaSeeds from './app/casos/seeds/causas.seed';
import DiagnosticosSeeds from './app/casos/seeds/diagnosticos.seed';
import TipoNotificacaoSeed from './app/casos-notificacoes/seeds/tipo-notificacao.seed';
import StatusMembroGrupoTrabalhoSeed from './app/casos-grupo-trabalho/seeds/status-membro-grupo.seed';
import SeedRunner from './shared/seeds/seed-runner';
import { EmailService } from './shared/email/email.service';
import StatusConviteGrupoTrabalhoSeed from './app/casos-grupo-trabalho/seeds/status-convite-grupo.seed';
import PerfisSeed from './app/usuarios/seeds/perfis.seed';
import PermissoesSeed from './app/usuarios/seeds/permissoes.seed';
import PerfilPermissoesSeed from './app/usuarios/seeds/perfil-permissoes.seed';
import UsuarioAdministradorSeed from './app/usuarios/seeds/usuario-administrador.seed';

@Injectable()
export default class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly ocorrenciaSeeds: OcorrenciaSeeds,
    private readonly causasSeeds: CausaSeeds,
    private readonly diagnosticoSeeds: DiagnosticosSeeds,
    private readonly tiposNotificacoesSeeds: TipoNotificacaoSeed,
    private readonly statusMembroGrupoSeeds: StatusMembroGrupoTrabalhoSeed,
    private readonly statusConviteGrupoSeeds: StatusConviteGrupoTrabalhoSeed,
    private readonly perfisSeed: PerfisSeed,
    private readonly permissoesSeed: PermissoesSeed,
    private readonly perfilPermissoesSeed: PerfilPermissoesSeed,
    private readonly usuarioAdministradorSeed: UsuarioAdministradorSeed,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('........ Seed das bases de dados: INICIANDO  ........');

    const runners: SeedRunner[] = [
      this.ocorrenciaSeeds,
      this.causasSeeds,
      this.diagnosticoSeeds,
      this.tiposNotificacoesSeeds,
      this.statusMembroGrupoSeeds,
      this.statusConviteGrupoSeeds,
      this.perfisSeed,
      this.permissoesSeed,
      this.perfilPermissoesSeed,
      this.usuarioAdministradorSeed,
    ];

    runners.forEach((runner) => runner.run());

    this.logger.log('........ Seed das bases de dados: FINALIZADO ........');
  }
}
