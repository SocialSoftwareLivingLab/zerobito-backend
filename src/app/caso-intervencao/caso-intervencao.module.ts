import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import CasoEntity from '@/app/casos/entities/caso.entity';
import MembroGrupoTrabalhoEntity from '@/app/casos-grupo-trabalho/entities/membro-grupo.entity';

import { ArquivoEntity } from '@/app/arquivos/entities/arquivo.entity';
import CasoIntervencaoEntity from './entities/acoes-intervencao.entity';
import { CasoIntervencaoController } from './caso-intervencao.controller';
import { CasoIntervencaoService } from './services/caso-intervencao.service';
import { ArquivoVinculoEntity } from '../arquivos/entities/arquivo.vinculo.entity';
import { ArquivoModule } from '../arquivos/arquivo.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      CasoIntervencaoEntity,
      CasoEntity,
      MembroGrupoTrabalhoEntity,
      ArquivoEntity,
      ArquivoVinculoEntity,
    ]),
    ArquivoModule,
  ],
  controllers: [CasoIntervencaoController],
  providers: [CasoIntervencaoService],
  exports: [CasoIntervencaoService],
})
export class CasoIntervencaoModule {}