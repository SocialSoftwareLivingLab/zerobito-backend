import { MensagensHelper } from '@/helpers/mensagens.helper';
import CasoEntity from '../../../entities/caso.entity';
import { entityToOcorrenciaResponse } from '@/app/ocorrencias/mappers/ocorrencia-mapper';
import AppException from '@/shared/exceptions/app-exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { OcorrenciaEntity } from '@/app/ocorrencias/entities/ocorrencias.entity';

@Injectable()
export default class ConsultarOcorrenciasUsecase {
    constructor(
        @InjectRepository(CasoEntity)
        private readonly casoRepository: Repository<CasoEntity>,
        @InjectRepository(OcorrenciaEntity)
        private readonly ocorrenciaRepository: Repository<OcorrenciaEntity>,
    ) {}

    public async listarOcorrenciasCaso(idCaso: number) {
        const caso = await this.casoRepository.findOne({
            where: { id: idCaso },
            relations: ['ocorrencias'],
        });

        if (!caso) {
            throw new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO);
        }

        const ocorrenciaIds = caso.ocorrencias.map(ocorrencia => ocorrencia.id);
        const ocorrencias = await this.ocorrenciaRepository.find({
            where: {
                id: In(ocorrenciaIds),
                dataExclusao: IsNull(),
            },
            relations: ['status', 'relator']
        });

        return ocorrencias;
    }
}
