import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import AppException from '@/shared/exceptions/app-exception';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import CasoEntity from '../../entities/caso.entity';

@Injectable()
export class ConsultarOcorrenciasUsecase {
    constructor(
        @InjectRepository(CasoEntity)
        private readonly casoRepository: Repository<CasoEntity>,
      ) {}

    public async listarOcorrenciasCaso(idCaso: number) {
        const caso = await this.casoRepository.findOne({
            where: { id: idCaso },
            relations: ['ocorrencias'],
        });

        if (!caso) {
            throw new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO);
        }
      
        return caso.ocorrencias
    
  }
}
