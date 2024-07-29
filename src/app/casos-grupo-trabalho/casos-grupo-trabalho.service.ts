import { Injectable } from '@nestjs/common';
import ListarMembrosGrupoUsecase from './usecases/listar-membros-grupo';

@Injectable()
export class CasosGrupoTrabalhoService {
  constructor(private readonly listarMembrosGrupo: ListarMembrosGrupoUsecase) {}

  public async listar(idCaso: number) {
    return await this.listarMembrosGrupo.listar({ idCaso });
  }
}

/**
 * 
POST /casos/{id}/grupo-trabalho/membros
GET /casos/{id}/grupo-trabalho/membros
POST /casos/{id}/grupo-trabalho/membros/{idMembro}/reenviar-convite
DELETE /casos/{id}/grupo-trabalho/membros/{idMembro}
 */
