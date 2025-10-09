import ConviteGrupoTrabalhoEntity from '@/app/casos-grupo-trabalho/entities/convite/convite-membro.entity';
import { StatusConviteGrupoTrabalhoEnum } from '@/app/casos-grupo-trabalho/enum/status-convite.enum';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import AppException from '@/shared/exceptions/app-exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import RegistrarMembroGrupoUseCase from '../../registrar-membro-grupo';
import { StatusMembroGrupoTrabalhoEnum } from '@/app/casos-grupo-trabalho/enum/status-membro.enum';
import StatusConviteGrupoTrabalhoEntity from '@/app/casos-grupo-trabalho/entities/convite/status-convite-membro.entity';
import { UsuarioPerfilService } from '@/app/usuario-perfil/entities/usuario-perfil.service';

export interface AceitarConviteMembroGrupoTrabalhoUsecaseRequest {
  identificadorConvite: string;
  usuarioAutenticado: UsuarioAutenticadoDto;
}

@Injectable()
export default class AceitarConviteMembroGrupoTrabalhoUsecase {
  constructor(
    @InjectRepository(ConviteGrupoTrabalhoEntity)
    private readonly conviteRepository: Repository<ConviteGrupoTrabalhoEntity>,
    @InjectRepository(StatusConviteGrupoTrabalhoEntity)
    private readonly statusConviteRepository: Repository<StatusConviteGrupoTrabalhoEntity>,
    private readonly registrarMembroAoGrupo: RegistrarMembroGrupoUseCase,
    private readonly casosPermissaoService: UsuarioPerfilService,
  ) {}

  public async aceitarConvite({
    identificadorConvite,
    usuarioAutenticado,
  }: AceitarConviteMembroGrupoTrabalhoUsecaseRequest) {
    const convite = await this.conviteRepository.findOne({
      where: {
        identificador: identificadorConvite,
        emailConvidado: usuarioAutenticado.email,
        status: {
          codigo: StatusConviteGrupoTrabalhoEnum.PENDENTE,
        },
      },
      relations: ['caso', 'criador'],
    });

    if (!convite) {
      throw new AppException(
        MensagensHelper.CasosConviteGrupoTrabalho.CONVITE_NAO_ENCONTRADO,
      );
    }

    const statusAceito = await this.statusConviteRepository.findOne({
      where: { codigo: StatusConviteGrupoTrabalhoEnum.ACEITADO },
    });

    convite.status = statusAceito;
    convite.dataAlteracao = new Date();

    await this.conviteRepository.save(convite);


    const statusPendente = await this.statusConviteRepository.findOne({
      where: { codigo: StatusConviteGrupoTrabalhoEnum.PENDENTE },
    });


    // Remove todos os outros convites pendentes para o mesmo email
    await this.conviteRepository
      .createQueryBuilder()
      .delete()
      .from(ConviteGrupoTrabalhoEntity)
      .where('emailConvidado = :email', { email: usuarioAutenticado.email })
      .andWhere('identificador != :identificador', {
        identificador: convite.identificador,
      })
      .andWhere('id_status = :statusPendenteId', {
        statusPendenteId: statusPendente.id,
      })
      .andWhere('id_caso = :idCaso', {
        idCaso: convite.caso.id
      })
      .execute();

    const novoMembro =await this.registrarMembroAoGrupo.registrar({
      idCaso: convite.caso.id,
      membro: {
        id: usuarioAutenticado.id,
      },
      solicitante: {
        id: convite.criador.id,
      },
      instituicao: convite.instituicaoConvidado,
      statusMembro: StatusMembroGrupoTrabalhoEnum.ACEITO
    });

    // Atribuir automaticamente o perfil MEMBRO ao novo membro
    await this.casosPermissaoService.criarPerfilUsuario(
      novoMembro.membro.id,
      6,
      novoMembro.caso.id
    );
  }
}
