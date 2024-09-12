import { MensagensHelper } from '@/helpers/mensagens.helper';
import AppException from '@/shared/exceptions/app-exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CasoEntity from '../../../entities/caso.entity';
import ConsultarCasoPorIdUsecase from '../consultar-casos/consultar-caso-by-id.usecase';

export interface AtualizarDataUsecaseRequest {
    id: number;
    dataCaso: Date;
  }

@Injectable()
export default class AtualizarDataCasoUsecase {
  constructor(
    private readonly consultarCasoPorIdUsecase: ConsultarCasoPorIdUsecase,
    @InjectRepository(CasoEntity)
    private readonly casoRepository: Repository<CasoEntity>,
  ) {}

  public async executar({
    id,
    dataCaso
  }: AtualizarDataUsecaseRequest) {
    const validacaoConsulta =
      await this.consultarCasoPorIdUsecase.buscarPorId(id);
    const caso: CasoEntity = validacaoConsulta.orElseThrow(
      () => new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO),
    );



    caso.dataCaso = dataCaso;

    await this.casoRepository.save(caso);
  }
}