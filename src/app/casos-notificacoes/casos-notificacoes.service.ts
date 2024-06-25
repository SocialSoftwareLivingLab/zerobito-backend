import { MensagensHelper } from '@/helpers/mensagens.helper';
import AppException from '@/shared/exceptions/app-exception';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CasoEntity from '../casos/entities/caso.entity';
import ConsultarCasoPorIdUsecase from '../casos/usecases/caso/consultar-casos/consultar-caso-by-id.usecase';
import TipoNotificacaoEntity from './entities/notificacao-tipo.entity';
import NotificacaoCasoEntity from './entities/notificacao.entity';
import { TipoNotificacaoResponse } from './payloads/tipo-notificacao.payload';
import {
  CriarNotificacaoRequest,
  CriarNotificacaoResponse,
} from './payloads/nova-notificacao.payload';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import {
  EditarNotificacaoRequest,
  NotificacaoCasoResponse,
} from './payloads/notificacoes.payload';

@Injectable()
export class CasosNotificacoesService {
  constructor(
    @InjectRepository(TipoNotificacaoEntity)
    private readonly tipoNotificacaoRepository: Repository<TipoNotificacaoEntity>,
    @InjectRepository(NotificacaoCasoEntity)
    private readonly notificacaoRepository: Repository<NotificacaoCasoEntity>,
    @Inject(forwardRef(() => ConsultarCasoPorIdUsecase))
    private readonly consultarCasoUseCase: ConsultarCasoPorIdUsecase,
  ) {}

  async buscarTiposNotificacoes(): Promise<TipoNotificacaoResponse[]> {
    const resultado = await this.tipoNotificacaoRepository.find({});

    return resultado.map((tipo) => {
      return {
        id: tipo.id,
        nome: tipo.nome,
        descricao: tipo.descricao,
      };
    });
  }

  async adicionarNotificacao(
    idCaso: number,
    payload: CriarNotificacaoRequest,
    usuarioAutenticado: UsuarioAutenticadoDto,
  ) {
    const caso = await this.buscarCasoPorId(idCaso);

    const tipoNotificacao = await this.tipoNotificacaoRepository.findOne({
      where: { nome: payload.tipo },
    });

    if (!tipoNotificacao) {
      throw new AppException(
        MensagensHelper.Notificacoes.TIPO_NOTIFICACAO_NAO_ENCONTRADO,
      );
    }

    const { identificador, isEmitida, dataEmissao, observacao } = payload;

    const notificacao = this.notificacaoRepository.create({
      identificador,
      isEmitida,
      dataEmissao,
      observacao,
      tipo: tipoNotificacao,
      caso,
      criador: {
        id: usuarioAutenticado.id,
      },
    });

    const notificacaoSalva = await this.notificacaoRepository.save(notificacao);

    const response = new CriarNotificacaoResponse();
    response.id = notificacaoSalva.id;
    response.identificacao = notificacaoSalva.identificador;
    response.isEmitida = notificacaoSalva.isEmitida;
    response.tipo = notificacaoSalva.tipo.nome;
    response.dataEmissao = notificacaoSalva.dataEmissao;
    response.dataCriacao = notificacaoSalva.dataCriacao;
    response.observacao = notificacaoSalva.observacao;

    return response;
  }

  public async buscarNotificacoesPorCaso(
    idCaso: number,
  ): Promise<NotificacaoCasoResponse[]> {
    const caso = await this.buscarCasoPorId(idCaso);

    const notificacoes = await this.notificacaoRepository.find({
      where: { caso: { id: caso.id } },
      relations: ['tipo', 'criador'],
    });

    return notificacoes.map((notificacao) => {
      return {
        id: notificacao.id,
        identificador: notificacao.identificador,
        isEmitida: notificacao.isEmitida,
        dataEmissao: notificacao.dataEmissao,
        observacao: notificacao.observacao,
        tipo: {
          id: notificacao.tipo.id,
          nome: notificacao.tipo.nome,
          descricao: notificacao.tipo.descricao,
        },
        dataCriacao: notificacao.dataCriacao,
        criador: {
          id: notificacao.criador.id,
          nome: notificacao.criador.nome,
          email: notificacao.criador.email,
        },
      } as NotificacaoCasoResponse;
    });
  }

  public async buscarNotificacaoPorIdentificador(
    idCaso: number,
    identificadorNotificacao: string,
  ): Promise<NotificacaoCasoResponse> {
    const caso = await this.buscarCasoPorId(idCaso);
    const notificacao = await this.notificacaoRepository.findOne({
      where: {
        caso: { id: caso.id },
        identificador: identificadorNotificacao,
      },
      relations: ['tipo', 'criador'],
    });
    return {
      id: notificacao.id,
      identificador: notificacao.identificador,
      isEmitida: notificacao.isEmitida,
      dataEmissao: notificacao.dataEmissao,
      observacao: notificacao.observacao,
      tipo: {
        id: notificacao.tipo.id,
        nome: notificacao.tipo.nome,
        descricao: notificacao.tipo.descricao,
      },
      dataCriacao: notificacao.dataCriacao,
      criador: {
        id: notificacao.criador.id,
        nome: notificacao.criador.nome,
        email: notificacao.criador.email,
      },
    } as NotificacaoCasoResponse;
  }

  public async editarNotificacao(
    id: number,
    identificador: string,
    request: EditarNotificacaoRequest,
  ) {
    const notificacao = await this.buscarNotificacaoPorIdentificador(
      id,
      identificador,
    );
    notificacao.isEmitida = request.isEmitida;

    this.notificacaoRepository.save(notificacao);
  }

  private async buscarCasoPorId(idCaso: number): Promise<CasoEntity> {
    const caso = await this.consultarCasoUseCase.buscarPorId(idCaso);

    return caso.orElseThrow(
      () => new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO),
    );
  }
}
