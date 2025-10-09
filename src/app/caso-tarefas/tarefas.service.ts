import { Injectable, Logger } from "@nestjs/common";
import ListarTarefasMembrosGrupoUseCase from "./usecases/listar-tarefas";
import RegistrarTarefaUseCase from "./usecases/registrar-tarefa";
import ListarTarefasCasoUseCase from "./usecases/todas-tarefas";
import EditarTarefaUseCase from "./usecases/editar-tarefa"; // ✅ novo import

@Injectable()
export class CasosTarefasService {
    private readonly logger = new Logger(CasosTarefasService.name);

    constructor(
        private readonly listarTarefasMembrosGrupo: ListarTarefasMembrosGrupoUseCase,
        private readonly registrarTarefasMembroGrupo: RegistrarTarefaUseCase,
        private readonly listarTarefasCaso: ListarTarefasCasoUseCase,
        private readonly editarTarefaUseCase: EditarTarefaUseCase,
    ) {}

    public async listarTarefa(idCaso: number, membroGrupoTrabalhoId: number) {
        return await this.listarTarefasMembrosGrupo.listar({ idCaso, membroGrupoTrabalhoId });
    }

    public async registrarTarefa(idCaso: number, nomeMembro: string, comentario: string, nome: string, prazo: Date) {
        return await this.registrarTarefasMembroGrupo.registrar({
            idCaso,
            nomeMembro,
            comentario,
            nome,
            prazo,
        });
    }

    public async listarTarefaCaso(idCaso: number) {
        return await this.listarTarefasCaso.listar({ idCaso });
    }

    public async editarTarefa(
        idTarefa: number,
        nome?: string,
        comentario?: string,
        prazo?: Date,
        statusCodigo?: string,
        statusConclusaoCodigo?: string,
        nomeMembro?: string,
        idCaso?: number,
    ) {
        return await this.editarTarefaUseCase.editar({
            idTarefa,
            nome,
            comentario,
            prazo,
            statusCodigo,
            statusConclusaoCodigo,
            nomeMembro,
            idCaso,
        });
    }
}
