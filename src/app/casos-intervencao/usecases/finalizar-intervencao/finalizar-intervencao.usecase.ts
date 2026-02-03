import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import AcaoIntervencaoEntity from '../../entities/acao-intervencao.entity';
import CasoEntity from '@/app/casos/entities/caso.entity';
import AppException from '@/shared/exceptions/app-exception';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import { StatusCasoEnum } from '@/app/casos/entities/status-caso.enum';
import { StatusConclusaoAcaoIntervencaoEnum } from '../../entities/status-conclusao-acao-intervencao.enum';

@Injectable()
export default class FinalizarIntervencaoUseCase {
    private readonly logger = new Logger(FinalizarIntervencaoUseCase.name);

    constructor(
        @InjectRepository(AcaoIntervencaoEntity)
        private readonly acaoIntervencaoRepository: Repository<AcaoIntervencaoEntity>,
        @InjectRepository(CasoEntity)
        private readonly casoRepository: Repository<CasoEntity>
    ) {}

    async executar(idCaso: number): Promise<void> {
        this.logger.log(`Finalizando intervenção do caso ${idCaso}...`);

        // Busca o caso
        const caso = await this.casoRepository.findOne({ where: { id: idCaso } });
        if (!caso) {
            throw new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO);
        }

        // Verifica se o caso está em intervenção
        if (caso.status !== StatusCasoEnum.EM_INTERVENCAO) {
            throw new AppException('Caso não está em intervenção');
        }

        // Busca todas as ações do caso
        const acoes = await this.acaoIntervencaoRepository.find({
            where: { caso: { id: idCaso } },
            relations: ['statusConclusao']
        });

        // Verifica se há pelo menos uma ação concluída com êxito ou satisfatória
        const temAcaoConcluida = acoes.some(
            (acao) =>
                acao.statusConclusao &&
                (acao.statusConclusao.codigo === StatusConclusaoAcaoIntervencaoEnum.CONCLUIDA_EXITO ||
                    acao.statusConclusao.codigo === StatusConclusaoAcaoIntervencaoEnum.CONCLUIDA_SATISFATORIA)
        );

        if (!temAcaoConcluida) {
            throw new AppException(
                'É necessário ter pelo menos uma ação concluída com êxito ou de forma satisfatória para finalizar a intervenção'
            );
        }

        // Atualiza o status do caso para FINALIZADO
        caso.status = StatusCasoEnum.FINALIZADO;
        await this.casoRepository.save(caso);

        this.logger.log(`Intervenção do caso ${idCaso} finalizada com sucesso`);
    }
}
