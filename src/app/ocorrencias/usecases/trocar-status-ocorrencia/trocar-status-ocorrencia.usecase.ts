import { Injectable } from '@nestjs/common';
import { StatusOcorrenciaEnum } from '../../enums/status-ocorrencia.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusOcorrenciaEntity } from '../../entities/status-ocorrencias.entity';
import { Repository } from 'typeorm';
import { OcorrenciaEntity } from '../../entities/ocorrencias.entity';

@Injectable()
export class TrocarStatusOcorrenciaUseCase {
  constructor(
    @InjectRepository(StatusOcorrenciaEntity)
    private readonly statusOcorrenciaRepository: Repository<StatusOcorrenciaEntity>,
    @InjectRepository(OcorrenciaEntity)
    private readonly ocorrenciaRepository: Repository<OcorrenciaEntity>,
  ) {}

  public async trocar(
    ocorrencia: OcorrenciaEntity,
    novoStatus: StatusOcorrenciaEnum,
  ) {
    const novoStatusEntity =
      await this.statusOcorrenciaRepository.findOneOrFail({
        where: { sigla: novoStatus },
      });

    ocorrencia.status = novoStatusEntity;
    ocorrencia.dataAlteracao = new Date();

    return await this.ocorrenciaRepository.save(ocorrencia);
  }
}
