import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import TarefaEntity from "../../entities/tarefa.entity";
import { Repository } from "typeorm";
import { v4 as uuid } from 'uuid';
import StatusTarefaEntity from "../../entities/status-tarefa.entity";
import MembroGrupoTrabalhoEntity from "@/app/casos-grupo-trabalho/entities/membro-grupo.entity";

export interface Request {
    idCaso: number;
    membro: {
        id: number;
    }
    comentario: string;
    nome: string;
    prazo: Date;
}

@Injectable()
export default class RegistrarTarefaUseCase {
    constructor(
        @InjectRepository(TarefaEntity)
        private readonly tarefaRepository: Repository<TarefaEntity>,
        @InjectRepository(StatusTarefaEntity)
        private readonly statusTarefaRepository: Repository<StatusTarefaEntity>,
        @InjectRepository(MembroGrupoTrabalhoEntity)
        private readonly membroGrupoTrabalhoRepository: Repository<MembroGrupoTrabalhoEntity>,
    ) {}

    public async registrar({
        idCaso,
        membro,
        comentario,
        nome,
        prazo,
    }: Request) {
        const identificador = uuid();

        const status = await this.statusTarefaRepository.findOne({
            where: {
                codigo: 'EM_ANDAMENTO',
            }
        });

        const membroGrupoTrabalho = await this.membroGrupoTrabalhoRepository.findOne({
            where: {
                caso: { id: idCaso},
                membro: membro,
            }
        })

        const novaTarefa = this.tarefaRepository.create({
            dataVinculo: new Date(),
            identificador,
            comentario,
            nome,
            prazo,
            status,
            membroGrupoTrabalho,
        });

        return this.tarefaRepository.save(novaTarefa);
    }
}
