import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import TarefaEntity from "../../entities/tarefa.entity";
import StatusTarefaEntity from "../../entities/status-tarefa.entity";
import StatusConclusaoTarefaEntity from "../../entities/status-conclusao-tarefa.entity";
import MembroGrupoTrabalhoEntity from "@/app/casos-grupo-trabalho/entities/membro-grupo.entity";

export interface Request {
    idTarefa: number;
    nome?: string;
    comentario?: string;
    prazo?: Date;
    statusCodigo?: string;
    statusConclusaoCodigo?: string;
    nomeMembro?: string;
    idCaso?: number;
}

@Injectable()
export default class EditarTarefaUseCase {
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

    public async editar({
        idTarefa,
        nome,
        comentario,
        prazo,
        statusCodigo,
        statusConclusaoCodigo,
        nomeMembro,
        idCaso,
    }: Request) {
        const tarefa = await this.tarefaRepository.findOne({
            where: { id: idTarefa },
            relations: ['status', 'status_conclusao', 'membroGrupoTrabalho'],
        });

        if (!tarefa) {
            throw new NotFoundException(`Tarefa com ID ${idTarefa} não encontrada.`);
        }

        // --- VALIDAÇÕES DE MEMBRO ---
        if (nomeMembro && idCaso) {
            const membroGrupoTrabalho = await this.membroGrupoTrabalhoRepository.findOne({
                where: {
                    caso: { id: idCaso },
                    membro: { nome: nomeMembro },
                },
            });

            if (!membroGrupoTrabalho) {
                throw new BadRequestException(
                    `Membro "${nomeMembro}" não encontrado no caso com ID ${idCaso}.`,
                );
            }

            tarefa.membroGrupoTrabalho = membroGrupoTrabalho;
        } else if (nomeMembro && !idCaso) {
            // nomeMembro informado, mas sem idCaso → cancela
            throw new BadRequestException(
                `Para alterar o membro, o ID do caso deve ser informado.`,
            );
        }

        // --- VALIDAÇÃO DE DATA ---
        if (prazo !== undefined) {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            const prazoDate = new Date(prazo);
            prazoDate.setHours(0, 0, 0, 0);

            if (prazoDate < hoje) {
                throw new BadRequestException(
                    `O prazo não pode ser anterior ao dia atual.`,
                );
            }

            tarefa.prazo = prazo;
        }

        // --- STATUS ---
        let novoStatus: StatusTarefaEntity | undefined;
        if (statusCodigo) {
            novoStatus = await this.statusTarefaRepository.findOne({
                where: { codigo: statusCodigo },
            });
            if (!novoStatus) {
                throw new NotFoundException(`Status "${statusCodigo}" não encontrado.`);
            }
        }

        // --- STATUS CONCLUSÃO ---
        let novoStatusConclusao: StatusConclusaoTarefaEntity | undefined;
        if (statusConclusaoCodigo) {
            novoStatusConclusao = await this.statusConclusaoTarefaRepository.findOne({
                where: { codigo: statusConclusaoCodigo },
            });
            if (!novoStatusConclusao) {
                throw new NotFoundException(
                    `Status de conclusão "${statusConclusaoCodigo}" não encontrado.`,
                );
            }
        }

        // --- REGRAS DE DEPENDÊNCIA ENTRE STATUS ---

        if (
            novoStatusConclusao?.codigo !== 'SEM_PREVISAO' &&
            (!novoStatus || novoStatus.codigo !== 'REALIZADO')
        ) {
            throw new BadRequestException(
                `O status de conclusão não pode ser diferente de sem previsão se o status for diferente de REALIZADO.`,
            );
        }

        if (
            novoStatusConclusao?.codigo === 'SEM_PREVISAO' &&
            (!novoStatus || novoStatus.codigo === 'REALIZADO')
        ) {
            throw new BadRequestException(
                `O status de conclusão sem previsão não pode ser definido quando o status for REALIZADO.`,
            );
        }

        // --- ATRIBUIÇÕES ---
        if (nome !== undefined) tarefa.nome = nome;
        if (comentario !== undefined) tarefa.comentario = comentario;
        if (novoStatus) tarefa.status = novoStatus;
        if (novoStatusConclusao) tarefa.status_conclusao = novoStatusConclusao;

        return this.tarefaRepository.save(tarefa);
    }
}
