import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CriarOcorrenciaRequest } from './dtos/criar-ocorrencia.dto';
import { FiltroConsultarOcorrenciasDto } from './dtos/filtro-ocorrencias.dto';
import { OcorrenciaDto } from './dtos/ocorrencia.dto';
import { OcorrenciaEntity } from './entities/ocorrencias.entity';
import { StatusOcorrenciaEntity } from './entities/status-ocorrencias.entity';
import { StatusOcorrenciaEnum } from './enums/status-ocorrencia.enum';
import { CondicaoVitimaEntity } from './entities/vitima/condicao-vitima.entity';
import { CondicaoVitimaOcorrenciaEnum } from './enums/condicao-vitima-ocorrencia.enum';

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

    return resultado.map((ocorrencia) => {
      const resultado = new OcorrenciaDto();
      resultado.data = ocorrencia.data;
      resultado.descricao = ocorrencia.descricao;
      resultado.empresa = ocorrencia.empresa;
      resultado.fonte = ocorrencia.fonte;
      resultado.id = ocorrencia.id;
      resultado.local = ocorrencia.local;
      resultado.status = {
        descricao: ocorrencia.status.descricao,
        sigla: StatusOcorrenciaEnum[ocorrencia.status.sigla],
      };
      resultado.vitima = {
        condicao:
          CondicaoVitimaOcorrenciaEnum[ocorrencia.vitima.condicao.sigla],
        nome: ocorrencia.vitima.nome,
        vinculo: ocorrencia.vitima.vinculo,
      };
      resultado.dataAlteracao = ocorrencia.dataAlteracao;
      return resultado;
    });
  }
}
