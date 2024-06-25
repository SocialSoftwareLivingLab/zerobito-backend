import { CoordenadoresService } from '@/app/coordenadores/coordenadores.service';
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
import LocalizacaoCaso from '@/app/casos/entities/localizacao/localizacao.entity';
import { CasosNotificacoesService } from '@/app/casos-notificacoes/casos-notificacoes.service';
import { CriarNotificacaoRequest } from '@/app/casos-notificacoes/payloads/nova-notificacao.payload';

@Injectable()
export class RegistrarCasoUseCase {
  constructor(
    @InjectRepository(CasoEntity)
    private readonly casosRepository: Repository<CasoEntity>,
    private readonly coordenadoresService: CoordenadoresService,
    @Inject(forwardRef(() => CasosNotificacoesService))
    private readonly casosNotificacoesService: CasosNotificacoesService,
  ) {}

  public async executar(
    request: RegistrarCasoRequest,
  ): Promise<RegistrarCasoResponse> {
    const {
      nome,
      coordenador: idCoordenador,
      criador,
      ocorrencias,
      local,
    } = request;

    const localizacao: LocalizacaoCaso = {
      latitude: local.latitude,
      longitude: local.longitude,
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

    const casoSalvo = await this.casosRepository.save(casoCriado);

    const tiposNotificacoes =
      await this.casosNotificacoesService.buscarTiposNotificacoes();

    // Crie uma notificação para cada tipo
    for (const tipo of tiposNotificacoes) {
      const notificacaoRequest: CriarNotificacaoRequest = {
        tipo: tipo.nome,
        identificador: `${tipo.id}-${new Date().getTime()}`,
        isEmitida: false,
        dataEmissao: new Date(),
        observacao: `Notificação automática do tipo ${tipo.nome}`,
      };
      await this.casosNotificacoesService.adicionarNotificacao(
        casoSalvo.id,
        notificacaoRequest,
        criador,
      );
    }

    return {
      id: casoSalvo.id,
      nome: casoSalvo.nome,
      coordenador: casoSalvo.coordenador.id,
      dataCriacao: casoSalvo.dataCriacao,
      localizacao: casoSalvo.localizacao,
    };
  }
}
