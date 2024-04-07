import { Injectable, Logger } from '@nestjs/common';
import { StatusOcorrenciaEntity } from '../entities/status-ocorrencias.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export default class OcorrenciaSeeds {
  private readonly logger = new Logger(OcorrenciaSeeds.name);

  constructor(
    @InjectRepository(StatusOcorrenciaEntity)
    private readonly statusOcorrenciaRepository: Repository<StatusOcorrenciaEntity>,
  ) {}

  public async run() {
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
}
