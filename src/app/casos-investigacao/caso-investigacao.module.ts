import { Module } from '@nestjs/common';
import { CasosModule } from '../casos/casos.module';
import { CasosInvestigacaoService } from './caso-investigacao.service';
import IniciarMapaEtapaUsecase from './usecases/inicializar-mapas';
import CasoMapaEtapaEntity from './entities/mapa-etapa.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasosInvestigacaoController } from './caso-investigacao.controller';
import { AlterarMapaEtapaUsecase } from './usecases/atualizar-mapa.usecase.ts';
import { BuscarMapaEtapasPorCasoUsecase } from './usecases/bucas-mapa-etapa.usecase.ts';

@Module({
  imports: [TypeOrmModule.forFeature([CasoMapaEtapaEntity]), CasosModule],
  providers: [
    CasosInvestigacaoService,
    IniciarMapaEtapaUsecase,
    AlterarMapaEtapaUsecase,
    BuscarMapaEtapasPorCasoUsecase,
    
  ],
  controllers: [CasosInvestigacaoController],
  exports: [
      CasosInvestigacaoService,
      IniciarMapaEtapaUsecase,
      AlterarMapaEtapaUsecase,
      BuscarMapaEtapasPorCasoUsecase,
    ],
})
export class CasosInvestigacaoModule { }
