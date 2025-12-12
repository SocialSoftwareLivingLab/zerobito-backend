import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CasoMapaEtapaEntity from '../../entities/mapa-etapa.entity';
import { MapaEtapaEnum } from '../../enum/etapa-enum';
import { MapaEtapaStatusEnum } from '../../enum/status-etapa.enum';

export interface AlterarMapaEtapaDTO {
  idCaso: number;
  name: MapaEtapaEnum;
  descricao?: string;
  novoStatus?: MapaEtapaStatusEnum;
}

@Injectable()
export class AlterarMapaEtapaUsecase {
  constructor(
    @InjectRepository(CasoMapaEtapaEntity)
    private readonly mapaEtapaRepository: Repository<CasoMapaEtapaEntity>,
  ) {}

  async execute(data: AlterarMapaEtapaDTO): Promise<CasoMapaEtapaEntity> {
    const etapa = await this.mapaEtapaRepository.findOne({
      where: {
        name: data.name,
        caso: { id: data.idCaso },
      },
      relations: ['caso'],
    });

    if (!etapa) {
      throw new Error(
        `Etapa '${data.name}' não encontrada para o caso ${data.idCaso}.`,
      );
    }

    // Atualiza descrição (sempre permitido)
    if (data.descricao !== undefined) {
      etapa.descricao = data.descricao;
    }

    if (data.novoStatus !== undefined && data.novoStatus !== etapa.status) {
      if (!this.isTransicaoValida(etapa.status, data.novoStatus)) {
        throw new BadRequestException({
          codigo: 'TRANSICAO_INVALIDA',
          mensagem: `Transição de status inválida: ${etapa.status} → ${data.novoStatus}`,
        });
      }
      etapa.status = data.novoStatus;
    }

    return this.mapaEtapaRepository.save(etapa);
  }

  /**
   * Regras de transição de status conforme critérios de aceitação
   */
  private isTransicaoValida(
    atual: MapaEtapaStatusEnum,
    novo: MapaEtapaStatusEnum,
  ): boolean {
    switch (atual) {
      case MapaEtapaStatusEnum.EM_ELABORACAO:
        return (
          novo === MapaEtapaStatusEnum.BLOQUEADA ||
          novo === MapaEtapaStatusEnum.FINALIZADA
        );
      case MapaEtapaStatusEnum.BLOQUEADA:
        return novo === MapaEtapaStatusEnum.EM_ELABORACAO;
      case MapaEtapaStatusEnum.FINALIZADA:
        return false; // nenhuma transição permitida
      default:
        return false;
    }
  }
}
