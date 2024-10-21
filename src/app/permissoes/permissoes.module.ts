import { Module } from '@nestjs/common';
import { PermissoesService } from './permissoes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissaoEntity } from './entities/permissao.entity';
import { PerfilUsuarioEntity } from './entities/perfil-usuario.entity';
import CadastrarPermissoesSeed from './seeds/cadastrar-permissoes.seed';

@Module({
  providers: [PermissoesService, CadastrarPermissoesSeed],
  imports: [TypeOrmModule.forFeature([PermissaoEntity, PerfilUsuarioEntity])],
  exports: [PermissoesService, CadastrarPermissoesSeed],
})
export class PermissoesModule {}
