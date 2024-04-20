import { Module } from '@nestjs/common';
import { CoordenadoresModule } from '../coordenadores/coordenadores.module';
import { CasosService } from './casos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import CasoEntity from './entities/caso.entity';
import RegistrarCasoUseCase from './usecases/registrar-caso/registrar-caso.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([CasoEntity]), CoordenadoresModule],
  providers: [RegistrarCasoUseCase, CasosService],
})
export class CasosModule {}
