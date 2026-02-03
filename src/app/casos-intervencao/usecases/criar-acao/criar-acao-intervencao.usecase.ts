import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import AcaoIntervencaoEntity from '../../entities/acao-intervencao.entity';
import StatusAcaoIntervencaoEntity from '../../entities/status-acao-intervencao.entity';
import TipoAcaoIntervencaoEntity from '../../entities/tipo-acao-intervencao.entity';
import MembroGrupoTrabalhoEntity from '@/app/casos-grupo-trabalho/entities/membro-grupo.entity';
import CasoEntity from '@/app/casos/entities/caso.entity';
import AppException from '@/shared/exceptions/app-exception';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import { CriarAcaoIntervencaoRequest } from '../../payloads/criar-editar-acao-intervencao.payload';

@Injectable()
export default class CriarAcaoIntervencaoUseCase {
    private readonly logger = new Logger(CriarAcaoIntervencaoUseCase.name);

    constructor(
        @InjectRepository(AcaoIntervencaoEntity)
        private readonly acaoIntervencaoRepository: Repository<AcaoIntervencaoEntity>,
        @InjectRepository(CasoEntity)
        private readonly casoRepository: Repository<CasoEntity>,
        @InjectRepository(MembroGrupoTrabalhoEntity)
        private readonly membroGrupoRepository: Repository<MembroGrupoTrabalhoEntity>,
        @InjectRepository(StatusAcaoIntervencaoEntity)
        private readonly statusAcaoRepository: Repository<StatusAcaoIntervencaoEntity>,
        @InjectRepository(TipoAcaoIntervencaoEntity)
        private readonly tipoAcaoRepository: Repository<TipoAcaoIntervencaoEntity>
    ) {}

    async executar(idCaso: number, payload: CriarAcaoIntervencaoRequest): Promise<void> {
        this.logger.log(`Criando ação de intervenção para o caso ${idCaso}...`);

        // Verifica se o caso existe
        const caso = await this.casoRepository.findOne({ where: { id: idCaso } });
        if (!caso) {
            throw new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO);
        }

        // Resolve o membro pelo nome (idêntico ao Planejamento)
        const responsavel = await this.membroGrupoRepository.findOne({
            where: {
                caso: { id: idCaso },
                membro: { nome: payload.nomeMembro },
            }
        });
        if (!responsavel) {
            throw new NotFoundException(
                `Membro "${payload.nomeMembro}" não encontrado no caso com ID ${idCaso}.`
            );
        }

        // Busca status PENDENTE
        const status = await this.statusAcaoRepository.findOne({
            where: { codigo: 'PENDENTE' }
        });
        if (!status) {
            throw new NotFoundException('Status "PENDENTE" não encontrado.');
        }

        // Busca tipo OUTRO como padrão
        const tipoAcao = await this.tipoAcaoRepository.findOne({
            where: { codigo: 'OUTRO' }
        });
        if (!tipoAcao) {
            throw new NotFoundException('Tipo de ação "OUTRO" não encontrado.');
        }

        // Cria a ação
        const novaAcao = this.acaoIntervencaoRepository.create({
            nome: payload.nome,
            caso,
            responsavel,
            status,
            tipoAcao,
            prazo: payload.prazo as any,
            comentario: payload.comentario
        });

        await this.acaoIntervencaoRepository.save(novaAcao);

        this.logger.log(`Ação de intervenção criada com sucesso para o caso ${idCaso}`);
    }
}
