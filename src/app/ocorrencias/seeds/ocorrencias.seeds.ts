import { Injectable, Logger } from '@nestjs/common';
import { StatusOcorrenciaEntity } from '../entities/status-ocorrencias.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CondicaoVitimaEntity } from '../entities/vitima/condicao-vitima.entity';
import SeedRunner from '@/shared/seeds/seed-runner';

@Injectable()
export default class OcorrenciaSeeds implements SeedRunner {
  private readonly logger = new Logger(OcorrenciaSeeds.name);

  constructor(
    @InjectRepository(StatusOcorrenciaEntity)
    private readonly statusOcorrenciaRepository: Repository<StatusOcorrenciaEntity>,
    @InjectRepository(CondicaoVitimaEntity)
    private readonly condicaoVitimaRepository: Repository<CondicaoVitimaEntity>,
  ) {}

  public async run() {
    this.seedStatusOcorrencia();
    this.seedCondicaoVitima();
  }

  private async seedStatusOcorrencia() {
    this.logger.log("Seed da tabela 'ocorrencia_status'...");

    const statusOcorrencias = [
      { sigla: 'AGUARDANDO_ANALISE', descricao: 'Aguardando Análise' },
      { sigla: 'ACEITO', descricao: 'Ocorrência aceita' },
      { sigla: 'MONITORANDO', descricao: 'Ocorrência em monitoramento' },
    ];

    for (const status of statusOcorrencias) {
      const statusOcorrencia = await this.statusOcorrenciaRepository.findOne({
        where: { sigla: status.sigla },
      });

      if (!statusOcorrencia) {
        await this.statusOcorrenciaRepository.save(status);
      }
    }
  }

  private async seedCondicaoVitima() {
    this.logger.log("Seed da tabela 'ocorrencia_vitima_condicao'...");

    const condicoesVitima = [
      { sigla: 'OBITO', descricao: 'Óbito' },
      { sigla: 'ATENDIMENTO_HOSPITALAR', descricao: 'Atendimento Hospitalar' },
      {
        sigla: 'INCIDENTE_ALTO_POTENCIAL',
        descricao: 'Incidente de Alto Potencial',
      },
    ];

    for (const condicao of condicoesVitima) {
      const condicaoVitima = await this.condicaoVitimaRepository.findOne({
        where: { sigla: condicao.sigla },
      });

      if (!condicaoVitima) {
        await this.condicaoVitimaRepository.save(condicao);
      }
    }
  }
}
