import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasosModule } from '../casos/casos.module';
import { CasosService } from '../casos/services/casos.service';
import { CasosNotificacoesController } from './casos-notificacoes.controller';
import { CasosNotificacoesService } from './casos-notificacoes.service';
import TipoNotificacaoEntity from './entities/notificacao-tipo.entity';
import NotificacaoCasoEntity from './entities/notificacao.entity';
import TipoNotificacaoSeed from './seeds/tipo-notificacao.seed';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoNotificacaoEntity, NotificacaoCasoEntity]),
    forwardRef(() => CasosModule),
  ],
  controllers: [CasosNotificacoesController],
  providers: [CasosNotificacoesService, TipoNotificacaoSeed],
  exports: [TipoNotificacaoSeed, CasosNotificacoesService],
})
export class CasosNotificacoesModule {}
