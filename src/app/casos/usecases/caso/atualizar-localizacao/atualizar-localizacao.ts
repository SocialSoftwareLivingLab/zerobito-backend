import { MensagensHelper } from '@/helpers/mensagens.helper';
import AppException from '@/shared/exceptions/app-exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CasoEntity from '../../../entities/caso.entity';
import ConsultarCasoPorIdUsecase from '../consultar-casos/consultar-caso-by-id.usecase';
import { Transactional } from 'typeorm-transactional';

export interface AtualizarLocalizacaoCasoUsecaseRequest {
  id: number;
  dados: {
    cidade: string;
    estado: string;
    logradouro: string;
    latitude: number;
    longitude: number;
  };
}

@Injectable()
export default class AtualizarLocalizacaoCasoUsecase {
  constructor(
    private readonly consultarCasoPorIdUsecase: ConsultarCasoPorIdUsecase,
    @InjectRepository(CasoEntity)
    private readonly casoRepository: Repository<CasoEntity>,
  ) {}

  @Transactional()
  public async executar({ id, dados }: AtualizarLocalizacaoCasoUsecaseRequest) {
    const validacaoConsulta =
      await this.consultarCasoPorIdUsecase.buscarPorId(id);

    const caso: CasoEntity = validacaoConsulta.orElseThrow(
      () => new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO),
    );

    caso.localizacao.cidade = dados.cidade;
    caso.localizacao.estado = dados.estado;
    caso.localizacao.logradouro = dados.logradouro;
    caso.localizacao.localizacao = {
      type: 'Point',
      coordinates: [dados.longitude, dados.latitude],
    };

    await this.casoRepository.save(caso);
  }
}
