import { Injectable } from "@nestjs/common";
import ListarTarefasMembrosGrupoUseCase from "./usecases/listar-tarefas";
import RegistrarTarefaUseCase from "./usecases/registrar-tarefa";

@Injectable()
export class CasosTarefasService {
    constructor(
        private readonly listarTarefasMembrosGrupo: ListarTarefasMembrosGrupoUseCase,
        private readonly registrarTarefasMembroGrupo: RegistrarTarefaUseCase,
    ) {}

    public async listarTarefa(idCaso: number, identificador: string){
        return await this.listarTarefasMembrosGrupo.listar({idCaso, identificador});
    }

    public async registrarTarefa(idCaso, nomeMembro, comentario, nome, prazo) {
        return await this.registrarTarefasMembroGrupo.registrar({idCaso, nomeMembro, comentario, nome, prazo});
    }
}