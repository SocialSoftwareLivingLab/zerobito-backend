import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasosGrupoTrabalhoController } from './casos-grupo-trabalho.controller';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StatusMembroGrupoTrabalhoEntity,
      StatusConviteGrupoTrabalhoEntity,
      MembroGrupoTrabalhoEntity,
      ConviteGrupoTrabalhoEntity,
    ]),
  ],
  providers: [
    CasosGrupoTrabalhoService,
    StatusMembroGrupoTrabalhoSeed,
    StatusConviteGrupoTrabalhoSeed,
    RegistrarMembroGrupoUseCase,
    ListarMembrosGrupoUsecase,
    VincularCoordenadorGrupoTrabalhoListener,
  ],
  exports: [StatusMembroGrupoTrabalhoSeed, StatusConviteGrupoTrabalhoSeed],
  controllers: [CasosGrupoTrabalhoController],
})
export class CasosGrupoTrabalhoModule {}
