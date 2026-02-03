import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import AcaoIntervencaoEntity from '../../entities/acao-intervencao.entity';
import { AcaoIntervencaoResponse } from '../../payloads/acao-intervencao.payload';
import AppException from '@/shared/exceptions/app-exception';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import ConsultarCasoPorIdUsecase from '@/app/casos/usecases/caso/consultar-casos/consultar-caso-by-id.usecase';

@Injectable()
export default class ListarAcoesMembroUseCase {
    private readonly logger = new Logger(ListarAcoesMembroUseCase.name);

    constructor(
        @InjectRepository(AcaoIntervencaoEntity)
        private readonly acaoIntervencaoRepository: Repository<AcaoIntervencaoEntity>,
        private readonly consultarCasoByIdUsecase: ConsultarCasoPorIdUsecase
    ) {}

    async executar(idCaso: number, idMembro: number): Promise<AcaoIntervencaoResponse[]> {
        this.logger.log(
            `Listando ações de intervenção do membro ${idMembro} no caso ${idCaso}...`
        );

        // Verifica se o caso existe
        const casoExiste = await this.consultarCasoByIdUsecase.casoExiste(idCaso);
        if (!casoExiste) {
            throw new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO);
        }

        // Busca ações do membro específico no caso
        const acoes = await this.acaoIntervencaoRepository.find({
            where: {
                caso: { id: idCaso },
                responsavel: { id: idMembro }
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
