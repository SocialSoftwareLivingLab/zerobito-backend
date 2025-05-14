import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import TarefaEntity from "../../entities/tarefa.entity";
import { Repository } from "typeorm";
import StatusTarefaEntity from "../../entities/status-tarefa.entity";

export interface AtualizarStatusTarefaUsecaseRequest {
    id: number;
    status: string;
}

@Injectable()
export default class AtualizarStatusTarefaUsecase {
    constructor(
        @InjectRepository(TarefaEntity)
        private readonly tarefaRepository: Repository<TarefaEntity>,
        @InjectRepository(StatusTarefaEntity)
        private readonly statusTarefaRepository: Repository<StatusTarefaEntity>,
    ) {}

    public async atualizar({
        id, status
    }: AtualizarStatusTarefaUsecaseRequest) {

        const statusNovo = await this.statusTarefaRepository.findOne({
            where: {
                codigo: status,
            }
        });

        const tarefa =  await this.tarefaRepository.findOne({
            where: {
                id: id,
            }
        });

        tarefa.status = statusNovo;

        return this.tarefaRepository.save(tarefa);
    }
}