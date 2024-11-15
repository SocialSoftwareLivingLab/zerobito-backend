import { Injectable } from "@nestjs/common";
import ListarTarefasMembrosGrupoUseCase from "./usecases/listar-tarefas";
import RegistrarTarefaUseCase from "./usecases/registrar-tarefa";

@Injectable()
export class CasosTarefasService {
    constructor(
        private readonly listarTarefasMembrosGrupo: ListarTarefasMembrosGrupoUseCase,
        private readonly registrarTarefasMembroGrupo: RegistrarTarefaUseCase,
    ) {}

    public async listarTarefa(idCaso: number, idMembro: number){
        return await this.listarTarefasMembrosGrupo.listar({idCaso, idMembro});
    }

    public async registrarTarefa(idCaso, membro, comentario, nome, prazo) {
        return await this.registrarTarefasMembroGrupo.registrar({idCaso, membro, comentario, nome, prazo});
    }
}