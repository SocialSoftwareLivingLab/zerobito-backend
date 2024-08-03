import { Injectable } from '@nestjs/common';
import ListarMembrosGrupoUsecase from './usecases/listar-membros-grupo';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { ConvidarMembroGrupoTrabalhoRequest } from './payloads/convidar-membro.payload';
import RegistrarConviteParaGrupoUsecase from './usecases/convite/registrar-convite-grupo';
import AceitarConviteMembroGrupoTrabalhoUsecase from './usecases/convite/aceitar-convite';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class CasosGrupoTrabalhoService {
  constructor(
    private readonly listarMembrosGrupo: ListarMembrosGrupoUsecase,
    private readonly registrarConvite: RegistrarConviteParaGrupoUsecase,
    private readonly aceitarConviteUsecase: AceitarConviteMembroGrupoTrabalhoUsecase,
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

  @Transactional()
  public async aceitarConvite(
    identificadorConvite: string,
    usuarioAutenticado: UsuarioAutenticadoDto,
  ) {
    await this.aceitarConviteUsecase.aceitarConvite({
      identificadorConvite,
      usuarioAutenticado,
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
