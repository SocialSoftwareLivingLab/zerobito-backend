import { Injectable } from '@nestjs/common';
import ListarMembrosGrupoUsecase from './usecases/listar-membros-grupo';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { ConvidarMembroGrupoTrabalhoRequest } from './payloads/convidar-membro.payload';
import RegistrarConviteParaGrupoUsecase from './usecases/registrar-convite-grupo';

@Injectable()
export class CasosGrupoTrabalhoService {
  constructor(
    private readonly listarMembrosGrupo: ListarMembrosGrupoUsecase,
    private readonly registrarConvite: RegistrarConviteParaGrupoUsecase,
  ) {}

  public async listar(idCaso: number) {
    return await this.listarMembrosGrupo.listar({ idCaso });
  }

  public async enviarConvite(
    idCaso: number,
    criador: UsuarioAutenticadoDto,
    payload: ConvidarMembroGrupoTrabalhoRequest,
  ) {
    await this.registrarConvite.registrar({
      caso: { id: idCaso },
      motivo: payload.motivo,
      criador,
      convidado: payload.convidado,
    });
  }
}

/**
 * 
POST /casos/{id}/grupo-trabalho/membros
GET /casos/{id}/grupo-trabalho/membros
POST /casos/{id}/grupo-trabalho/membros/{idMembro}/reenviar-convite
DELETE /casos/{id}/grupo-trabalho/membros/{idMembro}
 */
