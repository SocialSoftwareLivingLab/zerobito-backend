import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasosGrupoTrabalhoController } from './casos-grupo-trabalho.controller';
import { MembrosPerfilController } from './controllers/membros-perfil.controller';
import { CasosGrupoTrabalhoService } from './casos-grupo-trabalho.service';
import MembroGrupoTrabalhoEntity from './entities/membro-grupo.entity';

import StatusConviteGrupoTrabalhoEntity from './entities/convite/status-convite-membro.entity';
import StatusMembroGrupoTrabalhoEntity from './entities/status-membro.entity';
import VincularCoordenadorGrupoTrabalhoListener from './listeners/vincular-coordenador-grupo.listener';
import StatusConviteGrupoTrabalhoSeed from './seeds/status-convite-grupo.seed';
import StatusMembroGrupoTrabalhoSeed from './seeds/status-membro-grupo.seed';
import ListarMembrosGrupoUsecase from './usecases/listar-membros-grupo';
import RegistrarMembroGrupoUseCase from './usecases/registrar-membro-grupo';
import ConviteGrupoTrabalhoEntity from './entities/convite/convite-membro.entity';
import { CasosModule } from '../casos/casos.module';
import RegistrarConviteParaGrupoUsecase from './usecases/convite/registrar-convite-grupo';
import EnviarEmailConviteGrupoUsecase from './usecases/convite/enviar-email-convite';
import { EmailModule } from '@/shared/email/email.module';
import AceitarConviteMembroGrupoTrabalhoUsecase from './usecases/convite/aceitar-convite';
import IniciarPlanejamentoUsecase from './usecases/iniciar-planejamento';
import { CasosPermissaoService } from '../casos/services/casos-permissao.service';
import { PerfilEntity } from '../usuarios/entities/perfil.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StatusMembroGrupoTrabalhoEntity,
      StatusConviteGrupoTrabalhoEntity,
      MembroGrupoTrabalhoEntity,
      ConviteGrupoTrabalhoEntity,
      PerfilEntity,
    ]),
    CasosModule,
    EmailModule,
  ],
  providers: [
    CasosGrupoTrabalhoService,
    StatusMembroGrupoTrabalhoSeed,
    StatusConviteGrupoTrabalhoSeed,
    RegistrarMembroGrupoUseCase,
    RegistrarConviteParaGrupoUsecase,
    EnviarEmailConviteGrupoUsecase,
    ListarMembrosGrupoUsecase,
    AceitarConviteMembroGrupoTrabalhoUsecase,
    VincularCoordenadorGrupoTrabalhoListener,
    IniciarPlanejamentoUsecase,
    CasosPermissaoService,
  ],
  exports: [StatusMembroGrupoTrabalhoSeed, StatusConviteGrupoTrabalhoSeed],
  controllers: [CasosGrupoTrabalhoController, MembrosPerfilController],
})
export class CasosGrupoTrabalhoModule {}
