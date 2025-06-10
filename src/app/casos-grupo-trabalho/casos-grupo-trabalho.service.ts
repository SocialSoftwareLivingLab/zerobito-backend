import { Injectable } from '@nestjs/common';
import ListarMembrosGrupoUsecase from './usecases/listar-membros-grupo';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { ConvidarMembroGrupoTrabalhoRequest } from './payloads/convidar-membro.payload';
import RegistrarConviteParaGrupoUsecase from './usecases/convite/registrar-convite-grupo';
import AceitarConviteMembroGrupoTrabalhoUsecase from './usecases/convite/aceitar-convite';
import { Transactional } from 'typeorm-transactional';
import IniciarPlanejamentoUsecase from './usecases/iniciar-planejamento';
import RegistrarAtaReuniaoUseCase from './usecases/salvar-ata-reuniao';
import EmailConviteMembroGrupoTrabalhoUsecase from './usecases/convite/get-email-convite';
import RecusarConviteMembroGrupoTrabalhoUsecase from './usecases/convite/recusar-convite';

@Injectable()
export class CasosGrupoTrabalhoService {
  constructor(
    private readonly listarMembrosGrupo: ListarMembrosGrupoUsecase,
    private readonly registrarConvite: RegistrarConviteParaGrupoUsecase,
    private readonly aceitarConviteUsecase: AceitarConviteMembroGrupoTrabalhoUsecase,
    private readonly iniciarPlanejamentoUseCase: IniciarPlanejamentoUsecase,
    private readonly registrarAtaReuniaoUseCase: RegistrarAtaReuniaoUseCase,
    private readonly emailConviteUsecase: EmailConviteMembroGrupoTrabalhoUsecase,
    private readonly recusarConviteUseCase: RecusarConviteMembroGrupoTrabalhoUsecase,
  ) {}

  public async listar(idCaso: number) {
    return await this.listarMembrosGrupo.listar({ idCaso });
  }

  public async emailConvite(identificadorConvite: string) {
    return await this.emailConviteUsecase.emailConvite({ identificadorConvite });
  }

  public async registrarAta(
    idCaso: number,
    payload: string
  ) {
    await this.registrarAtaReuniaoUseCase.registrar({
      idCaso : idCaso,
      conteudo: payload
    })
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

  public async IniciarPlanejamento(
    idCaso: number,
  ) {
    await this.iniciarPlanejamentoUseCase.IniciarPlanejamento({
      caso: { id: idCaso },
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

  @Transactional()
  public async recusarConvite(
    identificadorConvite: string,
    usuarioAutenticado: UsuarioAutenticadoDto,
  ) {
    await this.recusarConviteUseCase.recusarConvite({
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
