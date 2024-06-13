import { MensagensHelper } from '@/helpers/mensagens.helper';
import AppException from '@/shared/exceptions/app-exception';
import { Injectable } from '@nestjs/common';
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

@Injectable()
export class CasosNotificacoesService {
  constructor(
    @InjectRepository(TipoNotificacaoEntity)
    private readonly tipoNotificacaoRepository: Repository<TipoNotificacaoEntity>,
    @InjectRepository(NotificacaoCasoEntity)
    private readonly notificacaoRepository: Repository<NotificacaoCasoEntity>,
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
    const validacaoConsulta =
      await this.consultarCasoUseCase.buscarPorId(idCaso);

    const caso: CasoEntity = validacaoConsulta.orElseThrow(
      () => new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO),
    );

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
}
