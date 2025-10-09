import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import MembroGrupoTrabalhoEntity from '../../entities/membro-grupo.entity';

import { v4 as uuid } from 'uuid';
import StatusMembroGrupoTrabalhoEntity from '../../entities/status-membro.entity';
import { StatusMembroGrupoTrabalhoEnum } from '../../enum/status-membro.enum';
import { PerfilEntity } from '@/app/usuarios/entities';

export interface Request {
  idCaso: number;
  membro: {
    id: number;
  };
  solicitante: {
    id: number;
  };
  instituicao: string;
  statusMembro: StatusMembroGrupoTrabalhoEnum;
}

@Injectable()
export default class RegistrarMembroGrupoUseCase {
  constructor(
    @InjectRepository(MembroGrupoTrabalhoEntity)
    private readonly membroGrupoRepository: Repository<MembroGrupoTrabalhoEntity>,
    @InjectRepository(StatusMembroGrupoTrabalhoEntity)
    private readonly statusMembroGrupoRepository: Repository<StatusMembroGrupoTrabalhoEntity>,
    @InjectRepository(PerfilEntity)
    private readonly perfilRepository: Repository<PerfilEntity>
  ) {}

  public async registrar({
    idCaso,
    membro,
    solicitante,
    instituicao,
    statusMembro,
  }: Request) {
    const identificador = uuid();

    const status = await this.statusMembroGrupoRepository.findOne({
      where: {
        codigo: statusMembro.toString(),
      },
    });

    const novoMembro = this.membroGrupoRepository.create({
      criador: {
        id: solicitante.id,
      },
      caso: {
        id: idCaso,
      },
      dataVinculo: new Date(),
      instituicao,
      membro,
      status,
    });

    //TODO: REGISTRAR PEFIL USUARIO

    return this.membroGrupoRepository.save(novoMembro);
  }
}
