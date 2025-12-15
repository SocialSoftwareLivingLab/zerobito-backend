import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MensagensHelper } from '../../../../helpers/mensagens.helper';
import { OcorrenciaEntity } from '../../entities/ocorrencias.entity';
import { CondicaoVitimaEntity } from '../../entities/vitima/condicao-vitima.entity';
import { BuscarOcorrenciaUseCase } from '../buscar-ocorrencia/buscar-ocorrencia.usecase';
import { AtualizarOcorrenciaUseCaseRequest } from './editar_ocorrencia.dto';
import { FieldUpdateStrategyFactory } from './strategies/field-update-strategy.factory';
import { DependenciasRepository } from './strategies/field-update.strategy';

@Injectable()
export class AtualizarOcorrenciaUseCase {
  private readonly logger = new Logger(AtualizarOcorrenciaUseCase.name);
  private readonly strategyFactory = new FieldUpdateStrategyFactory();

  constructor(
    @InjectRepository(OcorrenciaEntity)
    private readonly ocorrenciaRepository: Repository<OcorrenciaEntity>,
    @InjectRepository(CondicaoVitimaEntity)
    private readonly condicaoVitimaRepository: Repository<CondicaoVitimaEntity>,
    private readonly buscarOcorrenciaUseCase: BuscarOcorrenciaUseCase,
  ) {}

  async execute({
    id,
    dadosAtualizacao,
  }: AtualizarOcorrenciaUseCaseRequest): Promise<OcorrenciaEntity> {
    this.logger.log(`Iniciando atualização da ocorrência [id=${id}]`);

    const response = await this.buscarOcorrenciaUseCase.buscar(id);
    const ocorrencia = response.orElseThrow(() => {
      this.logger.warn(`Ocorrência não encontrada [id=${id}]`);
      return new NotFoundException(
        MensagensHelper.Ocorrencias.OCORRENCIA_NAO_ENCONTRADA,
      );
    });

    const repositories: DependenciasRepository = {
      condicaoVitimaRepository: this.condicaoVitimaRepository,
    };

    for (const [fieldName, value] of Object.entries(dadosAtualizacao)) {
      if (value === undefined) {
        this.logger.debug(`Campo ignorado (undefined): ${fieldName}`);
        continue;
      }

      const strategy = this.strategyFactory.getStrategy(fieldName);

      if (!strategy) {
        this.logger.warn(`Nenhuma strategy encontrada para o campo: ${fieldName}`);
        continue;
      }

      this.logger.debug(
        `Atualizando campo "${fieldName}" da ocorrência [id=${id}]`,
      );

      await strategy.editar(ocorrencia, fieldName, value, repositories);
    }

    const ocorrenciaSalva = await this.ocorrenciaRepository.save(ocorrencia);

    this.logger.log(`Ocorrência atualizada com sucesso [id=${id}]`);

    return ocorrenciaSalva;
  }
}
