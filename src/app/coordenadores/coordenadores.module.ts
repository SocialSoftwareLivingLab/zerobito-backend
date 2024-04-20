import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '../usuarios/usuarios.entity';
import { CoordenadoresController } from './coordenadores.controller';
import { CoordenadoresService } from './coordenadores.service';
import { BuscarCoordenadorUseCase } from './usecases/buscar-coordenador/buscar-coordenador.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  controllers: [CoordenadoresController],
  providers: [CoordenadoresService, BuscarCoordenadorUseCase],
  exports: [CoordenadoresService],
})
export class CoordenadoresModule {}
