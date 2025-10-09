import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, DiscoveryModule } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { OcorrenciasModule } from './app/ocorrencias/ocorrencias.module';
import { UsuariosModule } from './app/usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { ProtegidoGuard } from './auth/guards/protegido.guard';
import { CoordenadoresModule } from './app/coordenadores/coordenadores.module';
import { CasosModule } from './app/casos/casos.module';
import AppService from './app.service';
import { addTransactionalDataSource, getDataSourceByName } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { CasosNotificacoesModule } from './app/casos-notificacoes/casos-notificacoes.module';
import { CasosGrupoTrabalhoModule } from './app/casos-grupo-trabalho/casos-grupo-trabalho.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { eventEmitterConfig } from './config/events.config';
import { EmailModule } from './shared/email/email.module';
import { CasosPlanejamentoModule } from './app/casos-planejamento/casos-planejamento.module';
import { PermissaoGuard } from './auth/guards/permissao.guard';
import { PermissaoCasoGuard } from './app/casos/guards/permissao-caso.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { CasosTarefasGrupoTrabalhoModule } from './app/caso-tarefas/tarefas.module';
import { UsuarioPerfilModule } from './app/usuario-perfil/entities/usuario-perfil.module';
import MembroGrupoTrabalhoEntity from './app/casos-grupo-trabalho/entities/membro-grupo.entity';
import TarefaEntity from './app/caso-tarefas/entities/tarefa.entity';
import StatusTarefaEntity from './app/caso-tarefas/entities/status-tarefa.entity';
import CasoEntity from './app/casos/entities/caso.entity';
import { UsuarioEntity } from './app/usuarios/usuarios.entity';
import { PerfilEntity, PermissaoEntity } from './app/usuarios/entities';
import { OcorrenciaEntity } from './app/ocorrencias/entities/ocorrencias.entity';
import { StatusOcorrenciaEntity } from './app/ocorrencias/entities/status-ocorrencias.entity';
import { CondicaoVitimaEntity } from './app/ocorrencias/entities/vitima/condicao-vitima.entity';
import PalavraChaveEntity from './app/casos/entities/palavra-chave.entity';
import InformacoesBasicas from './app/casos/entities/info-basicas/info-basica.entity';
import CausaEntity from './app/casos/entities/info-basicas/causa.entity';
import DiagnosticoEntity from './app/casos/entities/info-basicas/diagnostico.entity';
import LocalizacaoCaso from './app/casos/entities/localizacao/localizacao.entity';
import StatusMembroGrupoTrabalhoEntity from './app/casos-grupo-trabalho/entities/status-membro.entity';
import TipoNotificacaoEntity from './app/casos-notificacoes/entities/notificacao-tipo.entity';
import StatusConviteGrupoTrabalhoEntity from './app/casos-grupo-trabalho/entities/convite/status-convite-membro.entity';
import ConviteGrupoTrabalhoEntity from './app/casos-grupo-trabalho/entities/convite/convite-membro.entity';
import UsuarioPerfilEntity from './app/usuario-perfil/entities/usuario-perfil.entity';
import AgendamentoReuniaoEntity from './app/casos-planejamento/entities/agendamento-reuniao.entity';
import AtaReuniaoEntity from './app/casos/entities/ata-reuniao/ata-reuniao.entity';
import StatusConclusaoTarefaEntity from './app/caso-tarefas/entities/status-conclusao-tarefa.entity';
import NotificacaoCasoEntity from './app/casos-notificacoes/entities/notificacao.entity';

@Module({
  imports: [
    DiscoveryModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      //__dirname + '/**/*.entity.{ts,js}'
      useFactory() {
        return {
          type: process.env.TYPEORM_CONNECTION,
          host: process.env.TYPEORM_HOST,
          port: process.env.TYPEORM_PORT,
          username: process.env.TYPEORM_USERNAME,
          password: process.env.TYPEORM_PASSWORD,
          database: process.env.TYPEORM_DATABASE,
          entities: [
            UsuarioEntity,
            PerfilEntity,
            PermissaoEntity,
            OcorrenciaEntity,
            StatusOcorrenciaEntity,
            CondicaoVitimaEntity,
            PalavraChaveEntity,
            InformacoesBasicas,
            DiagnosticoEntity,
            LocalizacaoCaso,
            CausaEntity,
            CasoEntity,
            UsuarioPerfilEntity,
            StatusMembroGrupoTrabalhoEntity,
            MembroGrupoTrabalhoEntity,
            TarefaEntity,
            StatusTarefaEntity,
            TipoNotificacaoEntity,
            StatusConviteGrupoTrabalhoEntity,
            ConviteGrupoTrabalhoEntity,
            AgendamentoReuniaoEntity,
            AtaReuniaoEntity,
            StatusConclusaoTarefaEntity,
            NotificacaoCasoEntity,
            ],
          synchronize: true,
          // logging: ['query'],
        } as TypeOrmModuleOptions;
      },
      async dataSourceFactory(options) {
        const dataSource = new DataSource(options);
        if (!getDataSourceByName('default')) {
          addTransactionalDataSource(dataSource);
        }
        return dataSource.initialize();
      },
    }),
    EventEmitterModule.forRoot(eventEmitterConfig),
    UsuariosModule,
    AuthModule,
    OcorrenciasModule,
    CoordenadoresModule,
    CasosModule,
    CasosNotificacoesModule,
    CasosGrupoTrabalhoModule,
    EmailModule,
    CasosPlanejamentoModule,
    CasosTarefasGrupoTrabalhoModule,
    UsuarioPerfilModule
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ProtegidoGuard },
    { provide: APP_GUARD, useClass: PermissaoGuard },
    { provide: APP_GUARD, useClass: PermissaoCasoGuard },
    AppService,
  ],
})
export class AppModule {}
