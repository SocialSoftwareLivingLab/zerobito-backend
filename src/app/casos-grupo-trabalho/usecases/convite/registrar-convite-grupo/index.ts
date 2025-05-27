import { CasosService } from '@/app/casos/services/casos.service';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import AppException from '@/shared/exceptions/app-exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import ConviteGrupoTrabalhoEntity from '../../../entities/convite/convite-membro.entity';
import StatusConviteGrupoTrabalhoEntity from '../../../entities/convite/status-convite-membro.entity';
import { StatusConviteGrupoTrabalhoEnum } from '../../../enum/status-convite.enum';

import { v4 as uuid } from 'uuid';
import EnviarEmailConviteGrupoUsecase from '../enviar-email-convite';
import { StatusCasoEnum } from '@/app/casos/entities/status-caso.enum';

export interface RegistrarConviteParaGrupoUsecaseRequest {
  motivo: string;
  caso: {
    id: number;
  };
  convidado: {
    nome: string;
    email: string;
    instituicao: string;
  };
  criador: UsuarioAutenticadoDto;
}

@Injectable()
export default class RegistrarConviteParaGrupoUsecase {
  constructor(
    private readonly casoService: CasosService,
    @InjectRepository(ConviteGrupoTrabalhoEntity)
    private readonly conviteRepository: Repository<ConviteGrupoTrabalhoEntity>,
    @InjectRepository(StatusConviteGrupoTrabalhoEntity)
    private readonly statusConviteRepository: Repository<StatusConviteGrupoTrabalhoEntity>,
    private readonly enviarEmailConvite: EnviarEmailConviteGrupoUsecase,
  ) {}

  public async registrar(payload: RegistrarConviteParaGrupoUsecaseRequest) {
    const { caso, convidado, motivo, criador } = payload;

    const casoInformadoExiste = await this.casoService.buscarCasoEspecifico(
      caso.id,
    );

    if (!casoInformadoExiste) {
      throw new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO);
    }

    if (casoInformadoExiste.status === StatusCasoEnum.AGUARDANDO_NOTIFICACOES) {
      await this.casoService.atualizarStatus(
        caso.id,
        StatusCasoEnum.EM_PREPARACAO,
      );
    }

    const existeConviteRegistrado = await this.conviteRepository.existsBy({
      emailConvidado: convidado.email,
      status: {
        codigo: In([
          StatusConviteGrupoTrabalhoEnum.ACEITADO,
        ]),
      },
      caso: {
        id: caso.id,
      },
    });

    if (existeConviteRegistrado) {
      throw new AppException(
        MensagensHelper.CasosConviteGrupoTrabalho.MEMBRO_NAO_PODE_SER_CONVIDADO,
      );
    }

    const statusPendente = await this.statusConviteRepository.findOne({
      where: { codigo: StatusConviteGrupoTrabalhoEnum.PENDENTE },
    });

    const convite = this.conviteRepository.create({
      caso: {
        id: caso.id,
      },
      criador: {
        id: criador.id,
      },
      dataCriacao: new Date(),
      emailConvidado: convidado.email,
      nomeConvidado: convidado.nome,
      instituicaoConvidado: convidado.instituicao,
      motivo,
      status: statusPendente,
      identificador: uuid(),
    });

    const conviteCriado = await this.conviteRepository.save(convite);

    await this.enviarEmailConvite.enviarEmail({
      identificadorConvite: conviteCriado.identificador,
    });
  }
}
