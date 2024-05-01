import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordenadoresModule } from '../coordenadores/coordenadores.module';
import { CasosController } from './casos.controller';
import { CasosService } from './casos.service';
import CasoEntity from './entities/caso.entity';
import { RegistrarCasoUseCase } from './usecases/registrar-caso/registrar-caso.usecase';
import { AdicionarOcorrenciaAoCasoUseCase } from './usecases/adicionar-ocorrencia/adicionar-ocorrencia.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([CasoEntity]), CoordenadoresModule],
  providers: [
    CasosService,
    RegistrarCasoUseCase,
    AdicionarOcorrenciaAoCasoUseCase,
  ],
  exports: [CasosService],
  controllers: [CasosController],
})
export class CasosModule {}
