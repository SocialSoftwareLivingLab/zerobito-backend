import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import AcaoIntervencaoEntity from '../../entities/acao-intervencao.entity';
import StatusAcaoIntervencaoEntity from '../../entities/status-acao-intervencao.entity';
import StatusConclusaoAcaoIntervencaoEntity from '../../entities/status-conclusao-acao-intervencao.entity';
import TipoAcaoIntervencaoEntity from '../../entities/tipo-acao-intervencao.entity';
import MembroGrupoTrabalhoEntity from '@/app/casos-grupo-trabalho/entities/membro-grupo.entity';
import AppException from '@/shared/exceptions/app-exception';
import { EditarAcaoIntervencaoRequest } from '../../payloads/criar-editar-acao-intervencao.payload';

@Injectable()
export default class EditarAcaoIntervencaoUseCase {
    private readonly logger = new Logger(EditarAcaoIntervencaoUseCase.name);

    constructor(
        @InjectRepository(AcaoIntervencaoEntity)
        private readonly acaoIntervencaoRepository: Repository<AcaoIntervencaoEntity>,
        @InjectRepository(MembroGrupoTrabalhoEntity)
        private readonly membroGrupoRepository: Repository<MembroGrupoTrabalhoEntity>,
        @InjectRepository(StatusAcaoIntervencaoEntity)
        private readonly statusAcaoRepository: Repository<StatusAcaoIntervencaoEntity>,
        @InjectRepository(StatusConclusaoAcaoIntervencaoEntity)
        private readonly statusConclusaoRepository: Repository<StatusConclusaoAcaoIntervencaoEntity>,
        @InjectRepository(TipoAcaoIntervencaoEntity)
        private readonly tipoAcaoRepository: Repository<TipoAcaoIntervencaoEntity>
    ) {}

    async executar(
        idCaso: number,
        idAcao: number,
        payload: EditarAcaoIntervencaoRequest
    ): Promise<void> {
        this.logger.log(`Editando ação ${idAcao} do caso ${idCaso}...`);

        // Busca a ação
        const acao = await this.acaoIntervencaoRepository.findOne({
            where: {
                id: idAcao,
                caso: { id: idCaso }
            },
            relations: ['caso', 'responsavel', 'status', 'statusConclusao', 'tipoAcao']
        });

        if (!acao) {
            throw new AppException('Ação não encontrada');
        }

        // Atualiza campos simples
        if (payload.nome !== undefined) {
            acao.nome = payload.nome;
        }
        if (payload.descricao !== undefined) {
            acao.descricao = payload.descricao;
        }
        if (payload.comentario !== undefined) {
            acao.comentario = payload.comentario;
        }
        if (payload.prazo !== undefined) {
            acao.prazo = new Date(payload.prazo);
        }
        if (payload.dataConclusao !== undefined) {
            acao.dataConclusao = new Date(payload.dataConclusao);
        }

        // Atualiza responsável se fornecido
        if (payload.idResponsavel !== undefined) {
            const responsavel = await this.membroGrupoRepository.findOne({
                where: {
                    id: payload.idResponsavel,
                    caso: { id: idCaso }
                }
            });
            if (!responsavel) {
                throw new AppException('Membro não encontrado ou não pertence ao caso');
            }
            acao.responsavel = responsavel;
        }

        // Atualiza status se fornecido
        if (payload.idStatus !== undefined) {
            const status = await this.statusAcaoRepository.findOne({
                where: { id: payload.idStatus }
            });
            if (!status) {
                throw new AppException('Status não encontrado');
            }
            acao.status = status;
        }

        // Atualiza status de conclusão se fornecido
        if (payload.idStatusConclusao !== undefined) {
            const statusConclusao = await this.statusConclusaoRepository.findOne({
                where: { id: payload.idStatusConclusao }
            });
            if (!statusConclusao) {
                throw new AppException('Status de conclusão não encontrado');
            }
            acao.statusConclusao = statusConclusao;
        }

        // Atualiza tipo de ação se fornecido
        if (payload.idTipoAcao !== undefined) {
            const tipoAcao = await this.tipoAcaoRepository.findOne({
                where: { id: payload.idTipoAcao }
            });
            if (!tipoAcao) {
                throw new AppException('Tipo de ação não encontrado');
            }
            acao.tipoAcao = tipoAcao;
        }

        await this.acaoIntervencaoRepository.save(acao);

        this.logger.log(`Ação ${idAcao} editada com sucesso`);
    }
}
