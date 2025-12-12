import { Injectable } from '@nestjs/common';
import IniciarMapaEtapaUsecase from './usecases/inicializar-mapas';
import { MapaEtapaStatusEnum } from './enum/status-etapa.enum';
import { AlterarMapaEtapaUsecase } from './usecases/atualizar-mapa.usecase.ts';
import { MapaEtapaEnum } from './enum/etapa-enum';
import { BuscarMapaEtapasPorCasoUsecase } from './usecases/bucas-mapa-etapa.usecase.ts';

@Injectable()
export class CasosInvestigacaoService {
  constructor(
    private readonly iniciarMapaEtapaUsecase: IniciarMapaEtapaUsecase,
    private readonly alterarMapaEtapaUsecase: AlterarMapaEtapaUsecase,
    private readonly buscarMapaEtapaUsecase: BuscarMapaEtapasPorCasoUsecase,
  ) {}


  public async iniciarMapaEtapa(idCaso: number) {
    await this.iniciarMapaEtapaUsecase.IniciarMapaEtapa({
      caso: { id: idCaso },
    });
  }

  public async alterarMapaEtapa(
    idCaso: number,
    name: MapaEtapaEnum,
    descricao?: string,
    novoStatus?: MapaEtapaStatusEnum,
  ) {
    return await this.alterarMapaEtapaUsecase.execute({
      idCaso: idCaso,
      name,
      descricao,
      novoStatus,
    });
  }

  public async buscarMapaEtapas(idCaso: number) {
    return await this.buscarMapaEtapaUsecase.execute(idCaso);
  }
}
