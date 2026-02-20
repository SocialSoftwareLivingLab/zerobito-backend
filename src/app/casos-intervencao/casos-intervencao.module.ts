import { Module } from '@nestjs/common';
import { CasosIntervencaoService } from './casos-intervencao.service';
import { CasosIntervencaoController } from './casos-intervencao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import AgendamentoReuniaoIntervencaoEntity from './entities/agendamento-reuniao.entity';
import AcaoIntervencaoEntity from './entities/acao-intervencao.entity';
import StatusAcaoIntervencaoEntity from './entities/status-acao-intervencao.entity';
import StatusConclusaoAcaoIntervencaoEntity from './entities/status-conclusao-acao-intervencao.entity';
import TipoAcaoIntervencaoEntity from './entities/tipo-acao-intervencao.entity';
import CasoEntity from '../casos/entities/caso.entity';
import MembroGrupoTrabalhoEntity from '../casos-grupo-trabalho/entities/membro-grupo.entity';
import AgendarReuniaoUsecase from './usecases/agendar-reuniao/agendar-reuniao.usecase';
import { CasosModule } from '../casos/casos.module';
import BuscarReuniaoUseCase from './usecases/buscar-agendamentos/buscar-agendamentos.usecase';
import IniciarInvestigacaoUsecase from './usecases/iniciar-investigacao';
import { CasosInvestigacaoService } from '../casos-investigacao/caso-investigacao.service';
import { CasosInvestigacaoModule } from '../casos-investigacao/caso-investigacao.module';
import ListarAcoesCasoUseCase from './usecases/listar-acoes/listar-acoes-caso.usecase';
import ListarAcoesMembroUseCase from './usecases/listar-acoes/listar-acoes-membro.usecase';
import CriarAcaoIntervencaoUseCase from './usecases/criar-acao/criar-acao-intervencao.usecase';
import EditarAcaoIntervencaoUseCase from './usecases/editar-acao/editar-acao-intervencao.usecase';
import FinalizarIntervencaoUseCase from './usecases/finalizar-intervencao/finalizar-intervencao.usecase';
import StatusAcaoIntervencaoSeed from './seeds/status-acao-intervencao.seed';
import TipoAcaoIntervencaoSeed from './seeds/tipo-acao-intervencao.seed';
import StatusConclusaoAcaoIntervencaoSeed from './seeds/status-conclusao-acao-intervencao.seed';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AgendamentoReuniaoIntervencaoEntity,
      AcaoIntervencaoEntity,
      StatusAcaoIntervencaoEntity,
      StatusConclusaoAcaoIntervencaoEntity,
      TipoAcaoIntervencaoEntity,
      CasoEntity,
      MembroGrupoTrabalhoEntity
    ]),
    CasosModule,
    CasosInvestigacaoModule
  ],
  providers: [
    CasosIntervencaoService,
    AgendarReuniaoUsecase,
    BuscarReuniaoUseCase,
    IniciarInvestigacaoUsecase,
    CasosInvestigacaoService,
    ListarAcoesCasoUseCase,
    ListarAcoesMembroUseCase,
    CriarAcaoIntervencaoUseCase,
    EditarAcaoIntervencaoUseCase,
    FinalizarIntervencaoUseCase,
    StatusAcaoIntervencaoSeed,
    TipoAcaoIntervencaoSeed,
    StatusConclusaoAcaoIntervencaoSeed,
  ],
  controllers: [CasosIntervencaoController],
  exports: [
    StatusAcaoIntervencaoSeed,
    TipoAcaoIntervencaoSeed,
    StatusConclusaoAcaoIntervencaoSeed,
  ]
})
export class CasosIntervencaoModule { }
