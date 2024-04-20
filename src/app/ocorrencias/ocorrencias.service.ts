import { MensagensHelper } from '@/helpers/mensagens.helper';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CriarOcorrenciaRequest } from './dtos/criar-ocorrencia.dto';
import { FiltroConsultarOcorrenciasDto } from './dtos/filtro-ocorrencias.dto';
import { OcorrenciaDto } from './dtos/ocorrencia.dto';
import { OcorrenciaEntity } from './entities/ocorrencias.entity';
import { StatusOcorrenciaEntity } from './entities/status-ocorrencias.entity';
import { CondicaoVitimaEntity } from './entities/vitima/condicao-vitima.entity';
import { StatusOcorrenciaEnum } from './enums/status-ocorrencia.enum';
import { entityToOcorrenciaResponse } from './mappers/ocorrencia-mapper';

@Injectable()
export class OcorrenciasService {
  constructor(
    @InjectRepository(OcorrenciaEntity)
    private readonly ocorrenciaRepository: Repository<OcorrenciaEntity>,
    @InjectRepository(StatusOcorrenciaEntity)
    private readonly statusOcorrenciaRepository: Repository<StatusOcorrenciaEntity>,
    @InjectRepository(CondicaoVitimaEntity)
    private readonly condicaoVitimaRepository: Repository<CondicaoVitimaEntity>,
  ) {}

  public async registrar(dados: CriarOcorrenciaRequest): Promise<void> {
    const status = await this.statusOcorrenciaRepository.findOneBy({
      sigla: StatusOcorrenciaEnum.AGUARDANDO_ANALISE,
    });

    const condicaoVitima = await this.condicaoVitimaRepository.findOneBy({
      sigla: dados.vitima.condicao,
    });

    const ocorrencia = this.ocorrenciaRepository.create({
      ...dados,
      status,
      vitima: {
        ...dados.vitima,
        condicao: condicaoVitima,
      },
    });

    await this.ocorrenciaRepository.save(ocorrencia);
  }

  public async consultarPorId(id: number): Promise<OcorrenciaDto> {
    try {
      const ocorrencia = await this.ocorrenciaRepository.findOneOrFail({
        where: {
          id,
          dataExclusao: IsNull(),
        },
        relations: ['status'],
      });

      return entityToOcorrenciaResponse(ocorrencia);
    } catch (error) {
      throw new NotFoundException(
        MensagensHelper.Ocorrencias.OCORRENCIA_NAO_ENCONTRADA,
      );
    }
  }

  public async consultarComFiltro(
    filtro: FiltroConsultarOcorrenciasDto,
  ): Promise<OcorrenciaDto[]> {
    const resultado = await this.ocorrenciaRepository.find({
      where: {
        status: {
          sigla: filtro.status,
        },
        dataExclusao: IsNull(),
      },
      relations: ['status'],
    });

    return resultado.map((ocorrencia) =>
      entityToOcorrenciaResponse(ocorrencia),
    );
  }
}
