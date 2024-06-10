import { CoordenadoresService } from '@/app/coordenadores/coordenadores.service';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CasoEntity from '../../../entities/caso.entity';
import {
  RegistrarCasoRequest,
  RegistrarCasoResponse,
} from './registrar-caso.dto';
import LocalizacaoCaso from '@/app/casos/entities/localizacao/localizacao.entity';

@Injectable()
export class RegistrarCasoUseCase {
  constructor(
    @InjectRepository(CasoEntity)
    private readonly casosRepository: Repository<CasoEntity>,
    private readonly coordenadoresService: CoordenadoresService,
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

    return {
      id: casoSalvo.id,
      nome: casoSalvo.nome,
      coordenador: casoSalvo.coordenador.id,
      dataCriacao: casoSalvo.dataCriacao,
      localizacao: casoSalvo.localizacao,
    };
  }
}
