import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CasoMapaEtapaEntity from '../../entities/mapa-etapa.entity';
import { MapaEtapaEnum } from '../../enum/etapa-enum';

@Injectable()
export class BuscarMapaEtapasPorCasoUsecase {
  constructor(
    @InjectRepository(CasoMapaEtapaEntity)
    private readonly mapaEtapaRepository: Repository<CasoMapaEtapaEntity>,
  ) {}

  /**
   * Retorna todas as etapas de um caso, ordenadas conforme o enum.
   * @param idCaso Identificador do caso
   */
  async execute(idCaso: number): Promise<CasoMapaEtapaEntity[]> {
    const etapas = await this.mapaEtapaRepository.find({
      where: { caso: { id: idCaso } },
      relations: ['caso'],
    });

    if (!etapas.length) {
      throw new NotFoundException(
        `Nenhuma etapa encontrada para o caso ${idCaso}.`,
      );
    }

    // Ordena conforme a ordem definida no enum MapaEtapaEnum
    const ordemEnum = Object.values(MapaEtapaEnum);
    etapas.sort(
      (a, b) =>
        ordemEnum.indexOf(a.name as MapaEtapaEnum) -
        ordemEnum.indexOf(b.name as MapaEtapaEnum),
    );

    return etapas;
  }
}
