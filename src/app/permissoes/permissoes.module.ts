import { Module } from '@nestjs/common';
import { PermissoesService } from './permissoes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissaoEntity } from './entities/permissao.entity';
import { PerfilUsuarioEntity } from './entities/perfil-usuario.entity';
import CadastrarPermissoesSeed from './seeds/cadastrar-permissoes.seed';
import PerfilMembroCasoEntity from './entities/perfil-membro-caso.entity';

@Module({
  providers: [PermissoesService, CadastrarPermissoesSeed],
  imports: [
    TypeOrmModule.forFeature([
      PermissaoEntity,
      PerfilUsuarioEntity,
      PerfilMembroCasoEntity,
    ]),
  ],
  exports: [PermissoesService, CadastrarPermissoesSeed],
})
export class PermissoesModule {}
