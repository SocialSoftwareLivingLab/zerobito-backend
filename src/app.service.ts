import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import OcorrenciaSeeds from './app/ocorrencias/seeds/ocorrencias.seeds';
import CausaSeeds from './app/casos/seeds/causas.seed';
import DiagnosticosSeeds from './app/casos/seeds/diagnosticos.seed';

@Injectable()
export default class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly ocorrenciaSeeds: OcorrenciaSeeds,
    private readonly causasSeeds: CausaSeeds,
    private readonly diagnosticoSeeds: DiagnosticosSeeds,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('........ Seed das bases de dados: INICIANDO  ........');

    await this.ocorrenciaSeeds.run();
    await this.causasSeeds.run();
    await this.diagnosticoSeeds.run();

    this.logger.log('........ Seed das bases de dados: FINALIZADO ........');
  }
}
