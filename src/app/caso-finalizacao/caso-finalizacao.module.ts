import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import CasoEntity from '@/app/casos/entities/caso.entity';
import RelatorioFinalizacaoEntity from './entities/relatorio-finalizacao.entity';
import AtorRelatorioFinalizacaoEntity from './entities/ator-relatorio-finalizacao.entity';
import { CasoFinalizacaoController } from './caso-finalizacao.controller';
import { CasoFinalizacaoService } from './services/caso-finalizacao.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RelatorioFinalizacaoEntity,
      AtorRelatorioFinalizacaoEntity,
      CasoEntity,
    ]),
  ],
  controllers: [CasoFinalizacaoController],
  providers: [CasoFinalizacaoService],
  exports: [CasoFinalizacaoService],
})
export class CasoFinalizacaoModule {}
