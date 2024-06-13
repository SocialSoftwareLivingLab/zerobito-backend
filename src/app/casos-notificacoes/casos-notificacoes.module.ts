import { Module } from '@nestjs/common';
import { CasosNotificacoesController } from './casos-notificacoes.controller';
import { CasosNotificacoesService } from './casos-notificacoes.service';
import TipoNotificacaoSeed from './seeds/tipo-notificacao.seed';
import { TypeOrmModule } from '@nestjs/typeorm';
import TipoNotificacaoEntity from './entities/notificacao-tipo.entity';
import NotificacaoCasoEntity from './entities/notificacao.entity';
import { CasosModule } from '../casos/casos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoNotificacaoEntity, NotificacaoCasoEntity]),
    CasosModule,
  ],
  controllers: [CasosNotificacoesController],
  providers: [CasosNotificacoesService, TipoNotificacaoSeed],
  exports: [TipoNotificacaoSeed],
})
export class CasosNotificacoesModule {}
