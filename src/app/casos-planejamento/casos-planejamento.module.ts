import { Module } from '@nestjs/common';
import { CasosPlanejamentoService } from './casos-planejamento.service';
import { CasosPlanejamentoController } from './casos-planejamento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import AgendamentoReuniaoEntity from './entities/agendamento-reuniao.entity';
import AgendarReuniaoUsecase from './usecases/agendar-reuniao/agendar-reuniao.usecase';
import { CasosModule } from '../casos/casos.module';
import BuscarReuniaoUseCase from './usecases/buscar-agendamentos/buscar-agendamentos.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([AgendamentoReuniaoEntity]), CasosModule],
  providers: [
    CasosPlanejamentoService,
    AgendarReuniaoUsecase,
    BuscarReuniaoUseCase
  ],
  controllers: [CasosPlanejamentoController]
})
export class CasosPlanejamentoModule { }
