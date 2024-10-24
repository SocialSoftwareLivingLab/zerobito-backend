import { StatusCasoEnum } from '@/app/casos/entities/status-caso.enum';
import { Injectable } from '@nestjs/common';
import ConsultarCasoPorIdUsecase from '../consultar-casos/consultar-caso-by-id.usecase';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import AppException from '@/shared/exceptions/app-exception';
import { Repository } from 'typeorm';
import CasoEntity from '@/app/casos/entities/caso.entity';
import { InjectRepository } from '@nestjs/typeorm';

export interface AtualizarStatusCasoUsecaseInput {
  idCaso: number;
  status: StatusCasoEnum;
}

@Injectable()
export default class AtualizarStatusCasoUsecase {
  constructor(
    private readonly consultarCasoPorIdUsecase: ConsultarCasoPorIdUsecase,
    @InjectRepository(CasoEntity)
    private readonly casoRepository: Repository<CasoEntity>,
  ) {}

  public async executar(payload: AtualizarStatusCasoUsecaseInput) {
    const casoResponse = await this.consultarCasoPorIdUsecase.buscarPorId(
      payload.idCaso,
    );
    const caso: CasoEntity = casoResponse.orElseThrow(
      () => new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO),
    );
    await this.casoRepository.update(
      { id: caso.id },
      { status: payload.status, dataAtualizacao: new Date() },
    );
  }
}
