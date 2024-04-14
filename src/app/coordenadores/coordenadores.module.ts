import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '../usuarios/usuarios.entity';
import { CoordenadoresController } from './coordenadores.controller';
import { CoordenadoresService } from './coordenadores.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  controllers: [CoordenadoresController],
  providers: [CoordenadoresService],
})
export class CoordenadoresModule {}
