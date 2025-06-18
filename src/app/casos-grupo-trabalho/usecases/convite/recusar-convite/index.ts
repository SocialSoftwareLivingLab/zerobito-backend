import ConviteGrupoTrabalhoEntity from '@/app/casos-grupo-trabalho/entities/convite/convite-membro.entity';
import { StatusConviteGrupoTrabalhoEnum } from '@/app/casos-grupo-trabalho/enum/status-convite.enum';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import AppException from '@/shared/exceptions/app-exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import StatusConviteGrupoTrabalhoEntity from '@/app/casos-grupo-trabalho/entities/convite/status-convite-membro.entity';

export interface RecusarConviteMembroGrupoTrabalhoUsecaseRequest {
  identificadorConvite: string;
  usuarioAutenticado: UsuarioAutenticadoDto;
}

@Injectable()
export default class RecusarConviteMembroGrupoTrabalhoUsecase {
  constructor(
    @InjectRepository(ConviteGrupoTrabalhoEntity)
    private readonly conviteRepository: Repository<ConviteGrupoTrabalhoEntity>,
    @InjectRepository(StatusConviteGrupoTrabalhoEntity)
    private readonly statusConviteRepository: Repository<StatusConviteGrupoTrabalhoEntity>,
  ) {}

  public async recusarConvite({
    identificadorConvite,
    usuarioAutenticado,
  }: RecusarConviteMembroGrupoTrabalhoUsecaseRequest) {
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

    const statusRecusado = await this.statusConviteRepository.findOne({
      where: { codigo: StatusConviteGrupoTrabalhoEnum.RECUSADO },
    });

    convite.status = statusRecusado;
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
  }
}
