import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { CasosService } from '../casos/casos.service';
import { AceitarOcorrenciaRequest } from './dtos/aceitar/aceitar-ocorrencia.dto';
import { CriarOcorrenciaRequest } from './dtos/criar-ocorrencia.dto';
import { FiltroConsultarOcorrenciasDto } from './dtos/filtro-ocorrencias.dto';
import { OcorrenciaDto } from './dtos/ocorrencia.dto';
import { OcorrenciaEntity } from './entities/ocorrencias.entity';
import { StatusOcorrenciaEntity } from './entities/status-ocorrencias.entity';
import { CondicaoVitimaEntity } from './entities/vitima/condicao-vitima.entity';
import { StatusOcorrenciaEnum } from './enums/status-ocorrencia.enum';
import { entityToOcorrenciaResponse } from './mappers/ocorrencia-mapper';
import { AceitarOcorrenciaUseCase } from './usecases/aceitar-ocorrencia/aceitar-ocorrencia.usecase';
import { BuscarOcorrenciaUseCase } from './usecases/buscar-ocorrencia/buscar-ocorrencia.usecase';

@Injectable()
export class OcorrenciasService {
  constructor(
    @InjectRepository(OcorrenciaEntity)
    private readonly ocorrenciaRepository: Repository<OcorrenciaEntity>,
    @InjectRepository(StatusOcorrenciaEntity)
    private readonly statusOcorrenciaRepository: Repository<StatusOcorrenciaEntity>,
    @InjectRepository(CondicaoVitimaEntity)
    private readonly condicaoVitimaRepository: Repository<CondicaoVitimaEntity>,
    private readonly buscarOcorrenciaUseCase: BuscarOcorrenciaUseCase,
    private readonly aceitarOcorrenciaUseCase: AceitarOcorrenciaUseCase,
    private readonly casoService: CasosService,
  ) {}

  public async registrar(
    dados: CriarOcorrenciaRequest,
    usuarioAutenticado: UsuarioAutenticadoDto,
  ): Promise<void> {
    const status = await this.statusOcorrenciaRepository.findOneBy({
      sigla: StatusOcorrenciaEnum.AGUARDANDO_ANALISE,
    });

    const condicaoVitima = await this.condicaoVitimaRepository.findOneBy({
      sigla: dados.vitima.condicao,
    });

    const ocorrencia = this.ocorrenciaRepository.create({
      ...dados,
      status,
      relator: {
        id: usuarioAutenticado.id,
      },
      vitima: {
        ...dados.vitima,
        condicao: condicaoVitima,
      },
    });

    await this.ocorrenciaRepository.save(ocorrencia);
  }

  public async consultarPorId(id: number): Promise<OcorrenciaDto> {
    const response = await this.buscarOcorrenciaUseCase.buscar(id);

    const ocorrenciaEncontrada = response.orElseThrow(
      () =>
        new NotFoundException(
          MensagensHelper.Ocorrencias.OCORRENCIA_NAO_ENCONTRADA,
        ),
    );

    return entityToOcorrenciaResponse(ocorrenciaEncontrada);
  }

  public async consultarComFiltro({
    status,
  }: FiltroConsultarOcorrenciasDto): Promise<OcorrenciaDto[]> {
    const resultado = await this.buscarOcorrenciaUseCase.buscarComFiltro({
      status,
    });

    return resultado.map((ocorrencia) =>
      entityToOcorrenciaResponse(ocorrencia),
    );
  }

  @Transactional()
  public async aceitar(
    id: number,
    dadosAceite: AceitarOcorrenciaRequest,
    usuarioAutenticado: UsuarioAutenticadoDto,
  ) {
    const { nome, coordenador } = dadosAceite.novoCaso;

    await this.aceitarOcorrenciaUseCase.aceitar({ id });
    const casoCriado = await this.casoService.registrarCaso({
      nome,
      coordenador,
      criador: usuarioAutenticado,
    });

    // this.casoService.vincularOcorrencia(casoCriado.id, id);

    return casoCriado;
  }
}
