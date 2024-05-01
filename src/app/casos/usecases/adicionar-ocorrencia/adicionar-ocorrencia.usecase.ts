import { OcorrenciasService } from '@/app/ocorrencias/ocorrencias.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CasoEntity from '../../entities/caso.entity';
import { AdicionarOcorrenciaAoCasoUseCaseInput } from './adicionar-ocorrencia.dto';

@Injectable()
export class AdicionarOcorrenciaAoCasoUseCase {
  constructor(
    @InjectRepository(CasoEntity)
    private readonly casoRepository: Repository<CasoEntity>,
    private readonly ocorrenciasService: OcorrenciasService,
  ) {}

  async execute({
    caso: casoId,
    ocorrencia: ocorrenciaId,
  }: AdicionarOcorrenciaAoCasoUseCaseInput): Promise<void> {
    const ocorrencia =
      await this.ocorrenciasService.consultarPorIdAsEntity(ocorrenciaId);

    const caso = await this.casoRepository.findOne({
      where: { id: casoId },
      relations: ['ocorrencias'],
    });

    caso.ocorrencias.push(ocorrencia);

    await this.casoRepository.save(caso);
  }
}
