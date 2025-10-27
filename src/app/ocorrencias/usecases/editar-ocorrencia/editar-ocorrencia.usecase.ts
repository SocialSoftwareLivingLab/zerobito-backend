import { Injectable, NotFoundException } from '@nestjs/common';
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
  private readonly strategyFactory = new FieldUpdateStrategyFactory();

  constructor(
    @InjectRepository(OcorrenciaEntity)
    private readonly ocorrenciaRepository: Repository<OcorrenciaEntity>,
    @InjectRepository(CondicaoVitimaEntity)
    private readonly condicaoVitimaRepository: Repository<CondicaoVitimaEntity>,
    private readonly buscarOcorrenciaUseCase: BuscarOcorrenciaUseCase,
  ) {}

  async execute({ id, dadosAtualizacao }: AtualizarOcorrenciaUseCaseRequest): Promise<OcorrenciaEntity> {
    const response = await this.buscarOcorrenciaUseCase.buscar(id);
    const ocorrencia = response.orElseThrow(
      () => new NotFoundException(MensagensHelper.Ocorrencias.OCORRENCIA_NAO_ENCONTRADA),
    );

    const repositories: DependenciasRepository = {
      condicaoVitimaRepository: this.condicaoVitimaRepository,
    };

    for (const [fieldName, value] of Object.entries(dadosAtualizacao)) {
      if (value === undefined) continue;

      const strategy = this.strategyFactory.getStrategy(fieldName);
      if (strategy) {
        await strategy.editar(ocorrencia, fieldName, value, repositories);
      }
    }

    return await this.ocorrenciaRepository.save(ocorrencia);
  }
}