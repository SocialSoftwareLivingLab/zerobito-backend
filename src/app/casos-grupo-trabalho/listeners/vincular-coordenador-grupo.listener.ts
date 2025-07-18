import {
  CasoCriadoEvent,
  CasoCriadoEventKey,
} from '@/app/casos/events/caso-criado.event';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import RegistrarMembroGrupoUseCase from '../usecases/registrar-membro-grupo';
import { StatusMembroGrupoTrabalhoEnum } from '../enum/status-membro.enum';

/**
 * Quando um caso é criado, é preciso registrar o coordenador como 
 * um membro do grupo de trabalho. O status de sua atividade como membro precisa
 * ser como ACEITO pois o vínculo inicial é obrigatório.
 * 
 * @author Leonardo Braz
 */
@Injectable()
export default class VincularCoordenadorGrupoTrabalhoListener {
  private readonly logger = new Logger(
    VincularCoordenadorGrupoTrabalhoListener.name,
  );

  constructor(
    private readonly registrarMembroUsecase: RegistrarMembroGrupoUseCase,
  ) {}

  @OnEvent(CasoCriadoEventKey)
  public async realizarVinculo(payload: CasoCriadoEvent) {
    const { id, criador, dataCriacao, entity, instituicao } = payload;

    this.logger.log(
      `Vinculando coordenador do caso ${id} para o grupo de trabalho`,
    );

    await this.registrarMembroUsecase.registrar({
      idCaso: id,
      membro: entity.coordenador,
      solicitante: criador,
      instituicao: instituicao,
      statusMembro: StatusMembroGrupoTrabalhoEnum.ACEITO,
      perfilId: 2,
    });
  }
}
