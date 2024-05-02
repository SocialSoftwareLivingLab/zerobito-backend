import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Optional } from 'typescript-optional';
import { OcorrenciaEntity } from '../../entities/ocorrencias.entity';
import { BuscarOcorrenciaFiltroInput } from './buscar-ocorrencia.dto';

const RELATIONS_PADROES = ['status'];

@Injectable()
export class BuscarOcorrenciaUseCase {
  constructor(
    @InjectRepository(OcorrenciaEntity)
    private readonly ocorrenciaRepository: Repository<OcorrenciaEntity>,
  ) {}

  public async buscar(id: number): Promise<Optional<OcorrenciaEntity>> {
    try {
      const ocorrencia = await this.ocorrenciaRepository.findOneOrFail({
        where: { id },
        relations: RELATIONS_PADROES,
      });
      return Optional.of(ocorrencia);
    } catch {
      return Optional.empty();
    }
  }

  public async buscarComFiltro({ status }: BuscarOcorrenciaFiltroInput) {
    const resultado = await this.ocorrenciaRepository.find({
      where: {
        status: {
          sigla: status,
        },
        dataExclusao: IsNull(),
      },
      relations: RELATIONS_PADROES,
    });

    return resultado;
  }
}
