import { Module } from '@nestjs/common';
import { CasosPlanejamentoService } from './casos-planejamento.service';
import { CasosPlanejamentoController } from './casos-planejamento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import AgendamentoReuniaoEntity from './entities/agendamento-reuniao.entity';
import AgendarReuniaoUsecase from './usecases/agendar-reuniao/agendar-reuniao.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([AgendamentoReuniaoEntity])],
  providers: [CasosPlanejamentoService],
  controllers: [CasosPlanejamentoController, AgendarReuniaoUsecase]
})
export class CasosPlanejamentoModule { }
