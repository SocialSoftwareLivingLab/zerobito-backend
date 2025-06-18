import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import TarefaEntity from "../../entities/tarefa.entity";
import { Repository } from "typeorm";

export interface Request {
    idCaso: number;
    membroGrupoTrabalhoId: number;
}

export interface TarefaResponse {
    identificador: string;
    nome: string;
    status: {
        codigo: string;
        nome: string;
    };
    prazo: Date;
    comentario: string;   
}

export interface Response {
    tarefas: TarefaResponse[];
}

@Injectable()
export default class ListarTarefasMembrosGrupoUseCase {
    private readonly logger = new Logger(ListarTarefasMembrosGrupoUseCase.name);

    constructor(
        @InjectRepository(TarefaEntity)
        private readonly tarefasRepository: Repository<TarefaEntity>,
    ) {}

    public async listar(req: Request){
        const { idCaso } = req;
        const { membroGrupoTrabalhoId } = req

        this.logger.log(
            `Pesquisando tarefas do membro ${membroGrupoTrabalhoId} grupo de trabalho para o caso ${idCaso}`,
        );
        
        const tarefasPromise =  this.tarefasRepository.find({
            where: {
                membroGrupoTrabalho: { caso: {id: idCaso}, id: membroGrupoTrabalhoId},
            },
            relations: ['membroGrupoTrabalho', 'status'],
        });

        const [tarefasEncontradas] = await Promise.all([
            tarefasPromise,
        ]);

        const tarefas: TarefaResponse[] = tarefasEncontradas.map((tarefa) => ({
                identificador: tarefa.identificador,
                nome: tarefa.nome,
                status: {
                    codigo: tarefa.status.codigo,
                    nome: tarefa.status.nome,
                },
                prazo: tarefa.prazo,
                comentario: tarefa.comentario,
        }));

        return {tarefas};
    }
}