import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import TarefaEntity from "../../entities/tarefa.entity";
import { Repository } from "typeorm";
import { v4 as uuid } from 'uuid';
import StatusTarefaEntity from "../../entities/status-tarefa.entity";
import MembroGrupoTrabalhoEntity from "@/app/casos-grupo-trabalho/entities/membro-grupo.entity";
import StatusConclusaoTarefaEntity from "../../entities/status-conclusao-tarefa.entity";

export interface Request {
    idCaso: number;
    nomeMembro: string;
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
        @InjectRepository(StatusConclusaoTarefaEntity)
        private readonly statusConclusaoTarefaRepository: Repository<StatusConclusaoTarefaEntity>,
        @InjectRepository(MembroGrupoTrabalhoEntity)
        private readonly membroGrupoTrabalhoRepository: Repository<MembroGrupoTrabalhoEntity>,
    ) {}

    public async registrar({
        idCaso,
        nomeMembro,
        comentario,
        nome,
        prazo,
    }: Request) {
        const identificador = uuid();
        console.log('nome:');
        console.log(nome);

        const status = await this.statusTarefaRepository.findOne({
            where: {
                codigo: 'EM_ANDAMENTO',
            }
        });

        if (!status) {
            throw new NotFoundException('Status "EM_ANDAMENTO" não encontrado.');
        }

        const status_conclusao = await this.statusConclusaoTarefaRepository.findOne({
            where: {
                codigo: 'SEM_PREVISAO',
            }
        })

        if(!status_conclusao){
            throw new NotFoundException('Status "SEM_PREVISAO" não encontrado.')
        }

        const membroGrupoTrabalho = await this.membroGrupoTrabalhoRepository.findOne({
            where: {
                caso: { id: idCaso },
                membro: { nome: nomeMembro },
            }
        });
        console.log(membroGrupoTrabalho);

        if (!membroGrupoTrabalho) {
            throw new NotFoundException(`Membro "${nomeMembro}" não encontrado no caso com ID ${idCaso}.`);
        }

        const novaTarefa = this.tarefaRepository.create({
            dataVinculo: new Date(),
            comentario,
            nome,
            prazo,
            status,
            status_conclusao,
            membroGrupoTrabalho,
        });

        return this.tarefaRepository.save(novaTarefa);
    }
}
