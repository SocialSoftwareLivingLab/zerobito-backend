import SeedRunner from "@/shared/seeds/seed-runner";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import StatusTarefaEntity from "../entities/status-tarefa.entity";
import { Repository } from "typeorm";
import { Seed } from "@/shared/seeds/seed.decorator";

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

@Seed()
@Injectable()
export default class StatusTarefaSeed implements SeedRunner {
    private readonly logger = new Logger(StatusTarefaSeed.name);

    constructor(
        @InjectRepository(StatusTarefaEntity)
        private readonly statusTarefaRepository: Repository<StatusTarefaEntity>,
    ) {}

    public async run() {
        this.seedStatus();
        this.logger.log("Seed da tabela 'tarefa_status' ...");
    }

    private async seedStatus() {
        const quantidade = await this.statusTarefaRepository.count();

        if (quantidade > 0) return;

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

}
