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
import { TokenRedefinicaoSenhaEntity } from './token-redefinicao.entity';
import { EmailModule } from '@/shared/email/email.module';
import { EnviarEmailRedefinicaoSenhaUsecase } from './usecase';
import UsuarioPerfilEntity from '../usuario-perfil/entities/usuario-perfil.entity';
import { UsuarioPerfilService } from '../usuario-perfil/entities/usuario-perfil.service';
import CasoEntity from '../casos/entities/caso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioEntity, PerfilEntity, PermissaoEntity, TokenRedefinicaoSenhaEntity, UsuarioPerfilEntity, CasoEntity]),
    EmailModule
  ],
  controllers: [UsuariosController],
  providers: [
    UsuariosService,
    UsuarioPerfilService,
    PerfisService,
    PerfisSeed,
    PermissoesSeed,
    PerfilPermissoesSeed,
    PerfisCasoSeed,
    UsuarioAdministradorSeed,
    PermissaoGuard,
    EnviarEmailRedefinicaoSenhaUsecase,
    UsuarioPerfilService,
  ],
  exports: [
    UsuariosService,
    UsuarioPerfilService,
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
