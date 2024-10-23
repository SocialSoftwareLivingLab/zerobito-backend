import LocalizacaoCaso from '@/app/casos/entities/localizacao/localizacao.entity';
import {
  CasoCriadoEvent,
  CasoCriadoEventKey,
} from '@/app/casos/events/caso-criado.event';
import { CoordenadoresService } from '@/app/coordenadores/coordenadores.service';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CasoEntity from '../../../entities/caso.entity';
import {
  RegistrarCasoRequest,
  RegistrarCasoResponse,
} from './registrar-caso.dto';
import { StatusCasoEnum } from '@/app/casos/entities/status-caso.enum';

@Injectable()
export class RegistrarCasoUseCase {
  constructor(
    @InjectRepository(CasoEntity)
    private readonly casosRepository: Repository<CasoEntity>,
    private readonly coordenadoresService: CoordenadoresService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async executar(
    request: RegistrarCasoRequest,
  ): Promise<RegistrarCasoResponse> {
    const { criador } = request;

    const casoSalvo = await this.criarCaso(request);

    const eventoCasoCriado: CasoCriadoEvent = {
      criador,
      entity: casoSalvo,
      id: casoSalvo.id,
      dataCriacao: casoSalvo.dataCriacao,
    };

    this.eventEmitter.emit(CasoCriadoEventKey, eventoCasoCriado);

    return {
      id: casoSalvo.id,
      nome: casoSalvo.nome,
      coordenador: casoSalvo.coordenador.id,
      dataCaso: casoSalvo.dataCaso,
      dataCriacao: casoSalvo.dataCriacao,
      localizacao: casoSalvo.localizacao,
    };
  }

  private async criarCaso(request: RegistrarCasoRequest): Promise<CasoEntity> {
    const {
      nome,
      coordenador: idCoordenador,
      dataCaso,
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
      dataCaso,
      dataCriacao: new Date(),
      ocorrencias,
      localizacao,
      status: StatusCasoEnum.AGUARDANDO_NOTIFICACOES,
    });

    return await this.casosRepository.save(casoCriado);
  }
}
