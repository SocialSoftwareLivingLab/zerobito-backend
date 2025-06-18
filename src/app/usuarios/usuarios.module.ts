import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuarios.entity';
<<<<<<< HEAD
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

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioEntity, PerfilEntity, PermissaoEntity, TokenRedefinicaoSenhaEntity]),
    EmailModule
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
    EnviarEmailRedefinicaoSenhaUsecase,
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
