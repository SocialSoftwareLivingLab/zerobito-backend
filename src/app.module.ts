import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, DiscoveryModule } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { OcorrenciasModule } from './app/ocorrencias/ocorrencias.module';
import { UsuariosModule } from './app/usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { PerfilGuard } from './auth/guards/perfil.guard';
import { ProtegidoGuard } from './auth/guards/protegido.guard';
import { CoordenadoresModule } from './app/coordenadores/coordenadores.module';
import { CasosModule } from './app/casos/casos.module';
import AppService from './app.service';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { CasosNotificacoesModule } from './app/casos-notificacoes/casos-notificacoes.module';
import { CasosGrupoTrabalhoModule } from './app/casos-grupo-trabalho/casos-grupo-trabalho.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { eventEmitterConfig } from './config/events.config';
import { EmailModule } from './shared/email/email.module';

@Module({
  imports: [
    DiscoveryModule,
    ConfigModule.forRoot(),
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
          // logging: true,
          
        } as TypeOrmModuleOptions;
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
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
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ProtegidoGuard },
    { provide: APP_GUARD, useClass: PerfilGuard },
    AppService,
  ],
})
export class AppModule {}
