import SeedRunner from "@/shared/seeds/seed-runner";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import StatusTarefaEntity from "../entities/status-tarefa.entity";
import { Repository } from "typeorm";
import { Seed } from "@/shared/seeds/seed.decorator";
import { StatusConclusaoTarefa } from "../enum/status-conclusao-tarefa.enum";
import StatusConclusaoTarefaEntity from "../entities/status-conclusao-tarefa.entity";

interface StatusType{
    codigo: string;
    nome: string;
    descricao: string;
}

const statusTarefa: StatusType[] = [
    {
        codigo: 'EM_ANDAMENTO',
        nome: 'Em andamento',
        descricao: 'Tarefa ainda não concluída porém dentro do prazo.'
    },
    {
        codigo: 'REALIZADO',
        nome: 'Realizado',
        descricao: 'Tarefa realizada.'
    },
    {
        codigo: 'ATRASADO',
        nome: 'Atrasado',
        descricao: 'Tarefa não realizada e fora do prazo de conclusão.'
    }
];

const statusConclusao: StatusType[] = [
    {
        codigo: 'EXITO',
        nome: "exito",
        descricao: 'Ação concluída com êxito.'
    },
    {
        codigo: 'SATISFATORIO',
        nome: "satisfatorio",
        descricao: 'Ação concluída de forma satisfatória.'
    },
    {
        codigo: 'SEM_PREVISAO',
        nome: "sem previsao",
        descricao: 'Ação sem previsão de conclusão'
    },
]

@Seed()
@Injectable()
export default class StatusTarefaSeed implements SeedRunner {
    private readonly logger = new Logger(StatusTarefaSeed.name);

    constructor(
        @InjectRepository(StatusTarefaEntity)
        private readonly statusTarefaRepository: Repository<StatusTarefaEntity>,
        @InjectRepository(StatusConclusaoTarefaEntity)
        private readonly statusConclusaoTarefaRepository: Repository<StatusConclusaoTarefaEntity>,
    ) {}

    public async run() {
        this.seedStatus();
        this.logger.log("Seed da tabela 'tarefa_status' ...");
    }

    private async seedStatus() {
        const quantidade = await this.statusTarefaRepository.count();
        const quantidade_conc = await this.statusConclusaoTarefaRepository.count();

        if (quantidade <= 0){

            this.logger.log(
                'Criando primeira listagem de status para as tarefas do grupo de trabalho',
            );

            for( const statusMapeado of statusTarefa) {
                const statusEntity = this.statusTarefaRepository.create();
                statusEntity.codigo = statusMapeado.codigo;
                statusEntity.nome = statusMapeado.nome;
                statusEntity.descricao = statusMapeado.descricao;

                await this.statusTarefaRepository.save(statusEntity);
            }
        }

        if (quantidade_conc <= 0){
            this.logger.log(
                'Criando primeira listagem de status de conclusão para as tarefas do grupo de trabalho',
            );

            for( const statusMapeado of statusConclusao) {
                const statusEntity = this.statusConclusaoTarefaRepository.create();
                statusEntity.codigo = statusMapeado.codigo;
                statusEntity.nome = statusMapeado.nome;
                statusEntity.descricao = statusMapeado.descricao;

                await this.statusConclusaoTarefaRepository.save(statusEntity);
            }
        }
    }

}
