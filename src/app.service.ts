import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import OcorrenciaSeeds from './app/ocorrencias/seeds/ocorrencias.seeds';

@Injectable()
export default class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly ocorrenciaSeeds: OcorrenciaSeeds) {}

  async onApplicationBootstrap() {
    this.logger.log('........ Seed das bases de dados: INICIANDO  ........');

    await this.ocorrenciaSeeds.run();

    this.logger.log('........ Seed das bases de dados: FINALIZADO ........');
  }
}
