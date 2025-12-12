import CasoEntity from '@/app/casos/entities/caso.entity';
import { PerfilEntity } from '@/app/usuarios/entities';
import { UsuarioEntity } from '@/app/usuarios/usuarios.entity';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioPerfilService } from './usuario-perfil.service';
import UsuarioPerfilEntity from './usuario-perfil.entity';
import { UsuarioPerfilController } from './ususario-perfil.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CasoEntity,
      PerfilEntity,
      UsuarioEntity,
      UsuarioPerfilEntity,
    ])
    //forwardRef(() => OcorrenciasModule),
  ],
  providers: [
   UsuarioPerfilService
  ],
  exports: [
    UsuarioPerfilService,
    TypeOrmModule.forFeature([UsuarioPerfilEntity])
  ],
  controllers: [UsuarioPerfilController],
})
export class UsuarioPerfilModule {}
