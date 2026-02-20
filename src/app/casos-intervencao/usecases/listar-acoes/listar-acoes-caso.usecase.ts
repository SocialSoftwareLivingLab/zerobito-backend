import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import AcaoIntervencaoEntity from '../../entities/acao-intervencao.entity';
import { AcaoIntervencaoResponse } from '../../payloads/acao-intervencao.payload';
import AppException from '@/shared/exceptions/app-exception';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import ConsultarCasoPorIdUsecase from '@/app/casos/usecases/caso/consultar-casos/consultar-caso-by-id.usecase';

@Injectable()
export default class ListarAcoesCasoUseCase {
    private readonly logger = new Logger(ListarAcoesCasoUseCase.name);

    constructor(
        @InjectRepository(AcaoIntervencaoEntity)
        private readonly acaoIntervencaoRepository: Repository<AcaoIntervencaoEntity>,
        private readonly consultarCasoByIdUsecase: ConsultarCasoPorIdUsecase
    ) {}

    async executar(idCaso: number): Promise<AcaoIntervencaoResponse[]> {
        this.logger.log(`Listando ações de intervenção do caso ${idCaso}...`);

        // Verifica se o caso existe
        const casoExiste = await this.consultarCasoByIdUsecase.casoExiste(idCaso);
        if (!casoExiste) {
            throw new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO);
        }

        // Busca todas as ações do caso
        const acoes = await this.acaoIntervencaoRepository.find({
            where: {
                caso: { id: idCaso }
            },
            relations: ['responsavel', 'responsavel.membro', 'status', 'statusConclusao', 'tipoAcao'],
            order: {
                prazo: 'ASC'
            }
        });

        // Mapeia para o formato de resposta
        return acoes.map((acao) => ({
            id: acao.id,
            nome: acao.nome,
            descricao: acao.descricao,
            responsavel: {
                id: acao.responsavel.id,
                nome: acao.responsavel.membro.nome
            },
            status: {
                id: acao.status.id,
                codigo: acao.status.codigo,
                nome: acao.status.nome
            },
            statusConclusao: acao.statusConclusao
                ? {
                      id: acao.statusConclusao.id,
                      codigo: acao.statusConclusao.codigo,
                      nome: acao.statusConclusao.nome
                  }
                : undefined,
            tipoAcao: {
                id: acao.tipoAcao.id,
                codigo: acao.tipoAcao.codigo,
                nome: acao.tipoAcao.nome
            },
            prazo: acao.prazo,
            dataConclusao: acao.dataConclusao,
            comentario: acao.comentario,
            dataCriacao: acao.dataCriacao
        }));
    }
}
