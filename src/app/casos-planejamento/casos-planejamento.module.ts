import { Module } from '@nestjs/common';
import { CasosPlanejamentoService } from './casos-planejamento.service';
import { CasosPlanejamentoController } from './casos-planejamento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import AgendamentoReuniaoEntity from './entities/agendamento-reuniao.entity';
import AgendarReuniaoUsecase from './usecases/agendar-reuniao/agendar-reuniao.usecase';
import { CasosModule } from '../casos/casos.module';
import BuscarReuniaoUseCase from './usecases/buscar-agendamentos/buscar-agendamentos.usecase';
import IniciarInvestigacaoUsecase from './usecases/iniciar-investigacao';
import { CasosInvestigacaoService } from '../casos-investigacao/caso-investigacao.service';
import { CasosInvestigacaoModule } from '../casos-investigacao/caso-investigacao.module';

@Module({
  imports: [TypeOrmModule.forFeature([AgendamentoReuniaoEntity]), CasosModule, CasosInvestigacaoModule],
  providers: [
    CasosPlanejamentoService,
    AgendarReuniaoUsecase,
    BuscarReuniaoUseCase,
    IniciarInvestigacaoUsecase,
    CasosInvestigacaoService,
  ],
  controllers: [CasosPlanejamentoController]
})
export class CasosPlanejamentoModule { }
