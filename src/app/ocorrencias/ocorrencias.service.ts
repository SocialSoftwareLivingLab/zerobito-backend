import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CriarOcorrenciaRequest } from './dtos/criar-ocorrencia.dto';
import { FiltroConsultarOcorrenciasDto } from './dtos/filtro-ocorrencias.dto';
import { OcorrenciaDto } from './dtos/ocorrencia.dto';
import { OcorrenciaEntity } from './entities/ocorrencias.entity';
import { StatusOcorrenciaEntity } from './entities/status-ocorrencias.entity';
import { StatusOcorrenciaEnum } from './enums/status-ocorrencia.enum';

@Injectable()
export class OcorrenciasService {
  constructor(
    @InjectRepository(OcorrenciaEntity)
    private readonly ocorrenciaRepository: Repository<OcorrenciaEntity>,
    @InjectRepository(StatusOcorrenciaEntity)
    private readonly statusOcorrenciaRepository: Repository<StatusOcorrenciaEntity>,
  ) {}

  public async registrar(dados: CriarOcorrenciaRequest): Promise<void> {
    const ocorrencia = this.ocorrenciaRepository.create(dados);

    const status = await this.statusOcorrenciaRepository.findOneBy({
      sigla: StatusOcorrenciaEnum.AGUARDANDO_ANALISE,
    });

    ocorrencia.status = status;

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
      resultado.vitima = ocorrencia.vitima;
      resultado.dataAlteracao = ocorrencia.dataAlteracao;
      resultado.dataCriacao = ocorrencia.dataCriacao;
      return resultado;
    });
  }
}
