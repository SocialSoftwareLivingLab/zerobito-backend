import { Injectable } from "@nestjs/common";
import ListarTarefasMembrosGrupoUseCase from "./usecases/listar-tarefas";
import RegistrarTarefaUseCase from "./usecases/registrar-tarefa";
import ListarTarefasCasoUseCase from "./usecases/todas-tarefas";

@Injectable()
export class CasosTarefasService {
    constructor(
        private readonly listarTarefasMembrosGrupo: ListarTarefasMembrosGrupoUseCase,
        private readonly registrarTarefasMembroGrupo: RegistrarTarefaUseCase,
        private readonly listarTarefasCaso: ListarTarefasCasoUseCase,
    ) {}

    public async listarTarefa(idCaso: number, membroGrupoTrabalhoId: number){
        return await this.listarTarefasMembrosGrupo.listar({idCaso, membroGrupoTrabalhoId});
    }

    public async registrarTarefa(idCaso, nomeMembro, comentario, nome, prazo) {
        return await this.registrarTarefasMembroGrupo.registrar({idCaso, nomeMembro, comentario, nome, prazo});
    }

    public async listarTarefaCaso(idCaso: number){
        return await this.listarTarefasCaso.listar({idCaso});
    }
}