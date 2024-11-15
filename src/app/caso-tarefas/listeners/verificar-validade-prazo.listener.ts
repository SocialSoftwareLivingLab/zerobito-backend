import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { Repository } from "typeorm";
import TarefaEntity from "../entities/tarefa.entity";
import { InjectRepository } from "@nestjs/typeorm";
import StatusTarefaEntity from "../entities/status-tarefa.entity";
import AtualizarStatusTarefaUsecase from "../usecases/atualizar-status.ts";

@Injectable()
export class AtualizarPrazoAtrasado {
    private readonly logger = new Logger(AtualizarPrazoAtrasado.name);
    constructor(
        @InjectRepository(TarefaEntity)
        private readonly tarefaRepository: Repository<TarefaEntity>,
        private readonly atualizarStatusTarefaUsecase: AtualizarStatusTarefaUsecase,
    ) {}

    @Cron('0 1 * * *')
    async handleCron(){
        this.logger.debug('Called every day 1 a.m');
        const statusAtrasado = 'ATRASADO';
        const hoje = new Date();

        const tarefas = await this.tarefaRepository.find();


        const tarefasAtrasadas = tarefas.filter(tarefa => 
            tarefa.prazo && new Date(tarefa.prazo) < hoje
        );

        this.logger.debug(`Tarefas atrasadas encontradas: ${tarefasAtrasadas.length}`);

        // Atualiza o status para cada tarefa atrasada
        for (const tarefa of tarefasAtrasadas) {
            await this.atualizarStatusTarefaUsecase.atualizar({
                id: tarefa.id,
                status: statusAtrasado,
            });
        }
    }
}