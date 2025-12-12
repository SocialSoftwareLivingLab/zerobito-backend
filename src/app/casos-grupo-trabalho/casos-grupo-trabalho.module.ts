import { forwardRef, Module } from '@nestjs/common';
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
import { CasosModule } from '../casos/casos.module';
import RegistrarConviteParaGrupoUsecase from './usecases/convite/registrar-convite-grupo';
import EnviarEmailConviteGrupoUsecase from './usecases/convite/enviar-email-convite';
import { EmailModule } from '@/shared/email/email.module';
import AceitarConviteMembroGrupoTrabalhoUsecase from './usecases/convite/aceitar-convite';
import IniciarPlanejamentoUsecase from './usecases/iniciar-planejamento';
import { PerfilEntity } from '../usuarios/entities/perfil.entity';
import AtaReuniaoEntity from '../casos/entities/ata-reuniao/ata-reuniao.entity';
import RegistrarAtaReuniaoUseCase from './usecases/salvar-ata-reuniao';
import EmailConviteMembroGrupoTrabalhoUsecase from './usecases/convite/get-email-convite';
import RecusarConviteMembroGrupoTrabalhoUsecase from './usecases/convite/recusar-convite';
import { UsuarioPerfilModule } from '../usuario-perfil/entities/usuario-perfil.module';
import AgendamentoReuniaoEntity from '../casos-planejamento/entities/agendamento-reuniao.entity';
import ObterAtaReuniaoUseCase from './usecases/obter-ata-reuniao';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StatusMembroGrupoTrabalhoEntity,
      StatusConviteGrupoTrabalhoEntity,
      MembroGrupoTrabalhoEntity,
      ConviteGrupoTrabalhoEntity,
      PerfilEntity,
      AtaReuniaoEntity,
      AgendamentoReuniaoEntity
    ]),
    CasosModule,
    EmailModule,
    forwardRef(() => UsuarioPerfilModule)
  ],
  providers: [
    CasosGrupoTrabalhoService,
    StatusMembroGrupoTrabalhoSeed,
    StatusConviteGrupoTrabalhoSeed,
    RegistrarMembroGrupoUseCase,
    RegistrarAtaReuniaoUseCase,
    ObterAtaReuniaoUseCase,
    RegistrarConviteParaGrupoUsecase,
    EnviarEmailConviteGrupoUsecase,
    ListarMembrosGrupoUsecase,
    AceitarConviteMembroGrupoTrabalhoUsecase,
    VincularCoordenadorGrupoTrabalhoListener,
    IniciarPlanejamentoUsecase,
    EmailConviteMembroGrupoTrabalhoUsecase,
    RecusarConviteMembroGrupoTrabalhoUsecase,
  ],
  exports: [StatusMembroGrupoTrabalhoSeed, StatusConviteGrupoTrabalhoSeed, TypeOrmModule.forFeature([MembroGrupoTrabalhoEntity])],
  controllers: [CasosGrupoTrabalhoController],
})
export class CasosGrupoTrabalhoModule {}
