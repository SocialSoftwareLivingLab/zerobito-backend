import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OcorrenciaEntity } from './entities/ocorrencias.entity';
import { StatusOcorrenciaEntity } from './entities/status-ocorrencias.entity';
import { OcorrenciasController } from './ocorrencias.controller';
import { OcorrenciasService } from './ocorrencias.service';
import OcorrenciaSeeds from './seeds/ocorrencias.seeds';

@Module({
  imports: [
    TypeOrmModule.forFeature([StatusOcorrenciaEntity, OcorrenciaEntity]),
  ],
  providers: [OcorrenciasService, OcorrenciaSeeds],
  controllers: [OcorrenciasController],
  exports: [OcorrenciaSeeds],
})
export class OcorrenciasModule {}
