import { CasosNotificacoesService } from '@/app/casos-notificacoes/casos-notificacoes.service';
import { CriarNotificacaoRequest } from '@/app/casos-notificacoes/payloads/nova-notificacao.payload';
import LocalizacaoCaso from '@/app/casos/entities/localizacao/localizacao.entity';
import { CoordenadoresService } from '@/app/coordenadores/coordenadores.service';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CasoEntity from '../../../entities/caso.entity';
import {
  RegistrarCasoRequest,
  RegistrarCasoResponse,
} from './registrar-caso.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RegistrarCasoUseCase {
  constructor(
    @InjectRepository(CasoEntity)
    private readonly casosRepository: Repository<CasoEntity>,
    private readonly coordenadoresService: CoordenadoresService,
    @Inject(forwardRef(() => CasosNotificacoesService))
    private readonly casosNotificacoesService: CasosNotificacoesService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  public async executar(
    request: RegistrarCasoRequest,
  ): Promise<RegistrarCasoResponse> {
    const { criador } = request;
    
    const casoSalvo = await this.criarCaso(request);

    await this.registrarNotificacoesIniciais(casoSalvo, criador);

    return {
      id: casoSalvo.id,
      nome: casoSalvo.nome,
      coordenador: casoSalvo.coordenador.id,
      dataCriacao: casoSalvo.dataCriacao,
      localizacao: casoSalvo.localizacao,
    };
  }

  private async criarCaso(request: RegistrarCasoRequest): Promise<CasoEntity> {
    const {
      nome,
      coordenador: idCoordenador,
      criador,
      ocorrencias,
      local,
    } = request;

    const localizacao: LocalizacaoCaso = {
      localizacao: null,
      cidade: local.cidade,
      estado: local.estado,
      logradouro: local.logradouro,
    };

    const encontrarCoordenador =
      await this.coordenadoresService.buscarCoordenadorPorId(idCoordenador);

    const coordenador = encontrarCoordenador.orElseThrow(
      () =>
        new BadRequestException(
          MensagensHelper.Coordenadores.COORDENADOR_NAO_ENCONTRADO,
        ),
    );

    const casoCriado = this.casosRepository.create({
      nome,
      coordenador,
      criador,
      dataCriacao: new Date(),
      ocorrencias,
      localizacao,
    });

    return await this.casosRepository.save(casoCriado);
  }

  private async registrarNotificacoesIniciais(casoCriado: CasoEntity, criador: UsuarioAutenticadoDto) {
    const tiposNotificacoes =
      await this.casosNotificacoesService.buscarTiposNotificacoes();

    // Crie uma notificação para cada tipo
    for (const tipo of tiposNotificacoes) {
      const notificacaoRequest: CriarNotificacaoRequest = {
        tipo: tipo.nome,
        identificador: "",
        isEmitida: false,
        statusNotificacao: 'Aguardando',
        dataEmissao: null,
        observacao: "",
      };
      
      await this.casosNotificacoesService.adicionarNotificacao(
        casoCriado.id,
        notificacaoRequest,
        criador,
      );
    }
  }
}
