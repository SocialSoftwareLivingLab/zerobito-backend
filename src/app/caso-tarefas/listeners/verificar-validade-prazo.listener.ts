import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
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

    async onModuleInit() {
        await this.handleCron(); // Executa assim que o módulo for iniciado
    }

    @Cron('0 1 * * *') // Roda a cada minuto
    async handleCron(){
        this.logger.debug('Called every day 1 a.m or when the module starts.');
        const statusAtrasado = 'ATRASADO';
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const tarefas = await this.tarefaRepository.find({relations: ['status']});

        const tarefasAtrasadas = tarefas.filter(tarefa => 
            tarefa.prazo && new Date(tarefa.prazo) < hoje && tarefa.status.codigo === 'EM_ANDAMENTO'
        );

        this.logger.debug(`Tarefas atrasadas encontradas: ${tarefasAtrasadas.length}`);

        for (const tarefa of tarefasAtrasadas) {
            this.logger.debug(tarefa.status.id)
            await this.atualizarStatusTarefaUsecase.atualizar({
                id: tarefa.id,
                status: statusAtrasado,
            });
        }
    }
}