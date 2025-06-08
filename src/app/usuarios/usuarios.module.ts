import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuarios.entity';
import { PerfilEntity } from './entities/perfil.entity';
import { PermissaoEntity } from './entities/permissao.entity';
import PerfisSeed from './seeds/perfis.seed';
import PermissoesSeed from './seeds/permissoes.seed';
import PerfilPermissoesSeed from './seeds/perfil-permissoes.seed';
import PerfisCasoSeed from './seeds/perfis-caso.seed';
import UsuarioAdministradorSeed from './seeds/usuario-administrador.seed';
import { PerfisService } from './services/perfis.service';
import { PermissaoGuard } from '@/auth/guards/permissao.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioEntity, PerfilEntity, PermissaoEntity]),
  ],
  controllers: [UsuariosController],
  providers: [
    UsuariosService,
    PerfisService,
    PerfisSeed,
    PermissoesSeed,
    PerfilPermissoesSeed,
    PerfisCasoSeed,
    UsuarioAdministradorSeed,
    PermissaoGuard,
  ],
  exports: [
    UsuariosService,
    PerfisService,
    PerfisSeed,
    PermissoesSeed,
    PerfilPermissoesSeed,
    PerfisCasoSeed,
    UsuarioAdministradorSeed,
    PermissaoGuard,
  ],
})
export class UsuariosModule {}
