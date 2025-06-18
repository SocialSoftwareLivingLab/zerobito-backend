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

export interface EmailConviteMembroGrupoTrabalhoUsecaseRequest {
  identificadorConvite: string;
}

@Injectable()
export default class EmailConviteMembroGrupoTrabalhoUsecase {
  constructor(
    @InjectRepository(ConviteGrupoTrabalhoEntity)
    private readonly conviteRepository: Repository<ConviteGrupoTrabalhoEntity>,
  ) {}

  public async emailConvite({
    identificadorConvite,
  }: EmailConviteMembroGrupoTrabalhoUsecaseRequest) {
    const convite = await this.conviteRepository.findOne({
      where: {
        identificador: identificadorConvite,
      },
    });

    if (!convite) {
      throw new AppException(
        MensagensHelper.CasosConviteGrupoTrabalho.CONVITE_NAO_ENCONTRADO,
      );
    }
    
    return convite.emailConvidado
  }
}
