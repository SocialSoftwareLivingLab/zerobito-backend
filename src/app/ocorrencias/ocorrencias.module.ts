import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasosModule } from '../casos/casos.module';
import { OcorrenciaEntity } from './entities/ocorrencias.entity';
import { StatusOcorrenciaEntity } from './entities/status-ocorrencias.entity';
import { CondicaoVitimaEntity } from './entities/vitima/condicao-vitima.entity';
import { OcorrenciasController } from './ocorrencias.controller';
import { OcorrenciasService } from './ocorrencias.service';
import OcorrenciaSeeds from './seeds/ocorrencias.seeds';
import { AceitarOcorrenciaUseCase } from './usecases/aceitar-ocorrencia/aceitar-ocorrencia.usecase';
import { BuscarOcorrenciaUseCase } from './usecases/buscar-ocorrencia/buscar-ocorrencia.usecase';
import { TrocarStatusOcorrenciaUseCase } from './usecases/trocar-status-ocorrencia/trocar-status-ocorrencia.usecase';
import { AtualizarOcorrenciaUseCase } from './usecases/editar-ocorrencia/editar-ocorrencia.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StatusOcorrenciaEntity,
      CondicaoVitimaEntity,
      OcorrenciaEntity,
    ]),
    forwardRef(() => CasosModule),
  ],
  providers: [
    OcorrenciasService,
    OcorrenciaSeeds,
    AceitarOcorrenciaUseCase,
    BuscarOcorrenciaUseCase,
    TrocarStatusOcorrenciaUseCase,
    AtualizarOcorrenciaUseCase,
  ],
  controllers: [OcorrenciasController],
  exports: [OcorrenciaSeeds],
})
export class OcorrenciasModule {}
