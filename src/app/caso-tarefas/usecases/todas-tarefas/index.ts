import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import TarefaEntity from "../../entities/tarefa.entity";
import { Repository } from "typeorm";
import { TarefaResponse } from "../listar-tarefas";

export interface Request {
    idCaso: number;
}


@Injectable()
export default class ListarTarefasCasoUseCase {
    private readonly logger = new Logger(ListarTarefasCasoUseCase.name);

    constructor(
        @InjectRepository(TarefaEntity)
        private readonly tarefasRepository: Repository<TarefaEntity>,
    ) {}

    public async listar(req: Request){
        const { idCaso } = req;

        this.logger.log(
            `Pesquisando tarefas para o caso ${idCaso}`,
        );
        
        const tarefasPromise =  this.tarefasRepository.find({
            where: {
                membroGrupoTrabalho: { caso: {id: idCaso}},
            },
            relations: ['status', 'status_conclusao'],
        });

        const [tarefasEncontradas] = await Promise.all([
            tarefasPromise,
        ]);

        const tarefas: TarefaResponse[] = tarefasEncontradas.map((tarefa) => ({
                id: tarefa.id,
                nome: tarefa.nome,
                status: {
                    codigo: tarefa.status.codigo,
                    nome: tarefa.status.nome,
                },
                status_conclusao: {
                    codigo: tarefa.status_conclusao.codigo,
                    nome: tarefa.status_conclusao.nome
                },
                prazo: tarefa.prazo,
                comentario: tarefa.comentario,
        }));

        return {tarefas};
    }
}