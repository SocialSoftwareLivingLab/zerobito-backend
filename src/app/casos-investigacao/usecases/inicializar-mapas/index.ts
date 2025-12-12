import { Injectable } from "@nestjs/common";
import { MapaEtapaEnum } from "../../enum/etapa-enum";
import CasoMapaEtapaEntity from "../../entities/mapa-etapa.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { MapaEtapaStatusEnum } from "../../enum/status-etapa.enum";

export interface IniciarMapaEtapaUsecaseRequest {
  caso: {
    id: number;
  };
}

@Injectable()
export default class IniciarMapaEtapaUsecase {
constructor(
    @InjectRepository(CasoMapaEtapaEntity)
    private readonly casoMapaEtapaRepository: Repository<CasoMapaEtapaEntity>,
  ) {}

  public async IniciarMapaEtapa(payload: IniciarMapaEtapaUsecaseRequest) {
    const { caso } = payload;

    const etapas = Object.values(MapaEtapaEnum).map((etapa) =>
      this.casoMapaEtapaRepository.create({
        name: etapa,
        status: MapaEtapaStatusEnum.EM_ELABORACAO,
        descricao: '',
        caso,
      }),
    );

    return this.casoMapaEtapaRepository.save(etapas);
    }
}