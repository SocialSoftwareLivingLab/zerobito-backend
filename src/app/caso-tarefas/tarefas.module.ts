import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import StatusTarefaEntity from "./entities/status-tarefa.entity";
import TarefaEntity from "./entities/tarefa.entity";
import { StatusMembroGrupoTrabalhoEnum } from "../casos-grupo-trabalho/enum/status-membro.enum";
import { CasosGrupoTrabalhoModule } from "../casos-grupo-trabalho/casos-grupo-trabalho.module";
import StatusTarefaSeed from "./seeds/tarefa.seed";
import RegistrarTarefaUseCase from "./usecases/registrar-tarefa";
import ListarTarefasMembrosGrupoUseCase from "./usecases/listar-tarefas";
import { CasosTarefasController } from "./tarefas.controller";
import AtualizarStatusTarefaUsecase from "./usecases/atualizar-status.ts";
import { CasosTarefasService } from "./tarefas.service";
import { AtualizarPrazoAtrasado } from "./listeners/verificar-validade-prazo.listener";
import ListarTarefasCasoUseCase from "./usecases/todas-tarefas";
import MembroGrupoTrabalhoEntity from "../casos-grupo-trabalho/entities/membro-grupo.entity";
import EditarTarefaUseCase from "./usecases/editar-tarefa";
import StatusConclusaoTarefaEntity from "./entities/status-conclusao-tarefa.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            StatusTarefaEntity,
            StatusConclusaoTarefaEntity,
            TarefaEntity,
            MembroGrupoTrabalhoEntity,
        ]),
        CasosGrupoTrabalhoModule,
    ],
    providers: [
        CasosTarefasService,
        StatusTarefaSeed,
        RegistrarTarefaUseCase,
        ListarTarefasMembrosGrupoUseCase,
        ListarTarefasCasoUseCase,
        AtualizarStatusTarefaUsecase,
        EditarTarefaUseCase,
        AtualizarPrazoAtrasado,
    ],
    exports: [StatusTarefaSeed],
    controllers: [CasosTarefasController],
})
export class CasosTarefasGrupoTrabalhoModule {}