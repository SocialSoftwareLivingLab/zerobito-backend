import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import CasoEntity from '../../entities/caso.entity';
import { AdicionarOcorrenciaAoCasoUseCaseInput } from './adicionar-ocorrencia.dto';
import AppException from '@/shared/exceptions/app-exception';
import { MensagensHelper } from '@/helpers/mensagens.helper';

@Injectable()
export class AdicionarOcorrenciaAoCasoUseCase {
  constructor(
    @InjectRepository(CasoEntity)
    private readonly casoRepository: Repository<CasoEntity>,
  ) {}

  @Transactional()
  async adicionar({
    caso: casoId,
    ocorrencia,
  }: AdicionarOcorrenciaAoCasoUseCaseInput): Promise<void> {
    const caso = await this.casoRepository.findOne({
      where: { id: casoId },
      relations: ['ocorrencias'],
    });

    if (!caso) {
      throw new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO);
    }

    caso.ocorrencias.push(ocorrencia);

    await this.casoRepository.save(caso);
  }
}
