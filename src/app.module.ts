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

@Module({
  imports: [
    DiscoveryModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: process.env.TYPEORM_CONNECTION,
          host: process.env.TYPEORM_HOST,
          port: process.env.TYPEORM_PORT,
          username: process.env.TYPEORM_USERNAME,
          password: process.env.TYPEORM_PASSWORD,
          database: process.env.TYPEORM_DATABASE,
          entities: [__dirname + '/**/*.entity.{ts,js}'],
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
