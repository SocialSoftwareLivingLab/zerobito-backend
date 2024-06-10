import { MensagensHelper } from '@/helpers/mensagens.helper';
import AppException from '@/shared/exceptions/app-exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CasoEntity from '../../../entities/caso.entity';
import ConsultarCasoPorIdUsecase from '../consultar-casos/consultar-caso-by-id.usecase';

export interface AtualizarLocalizacaoCasoUsecaseRequest {
  id: number;
  dados: {
    cidade: string | null;
    estado: string | null;
    logradouro: string | null;
  };
}

@Injectable()
export default class AtualizarLocalizacaoCasoUsecase {
  constructor(
    private readonly consultarCasoPorIdUsecase: ConsultarCasoPorIdUsecase,
    @InjectRepository(CasoEntity)
    private readonly casoRepository: Repository<CasoEntity>,
  ) {}

  public async executar({ id, dados }: AtualizarLocalizacaoCasoUsecaseRequest) {
    const validacaoConsulta =
      await this.consultarCasoPorIdUsecase.buscarPorId(id);

    console.log(id, dados);

    const caso: CasoEntity = validacaoConsulta.orElseThrow(
      () => new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO),
    );

    console.log(caso);

    //logica de consulta tipo de causa / diagnostico para longitude e latitude ???

    caso.localizacao.cidade = dados.cidade;
    caso.localizacao.estado = dados.estado;
    caso.localizacao.logradouro = dados.logradouro;
    //fazer logica de latitude longitude aqui

    await this.casoRepository.save(caso);
  }
}
