import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import MembroGrupoTrabalhoEntity from '../../entities/membro-grupo.entity';

import { v4 as uuid } from 'uuid';

export interface Request {
  idCaso: number;
  membro: {
    id: number;
  };
  solicitante: UsuarioAutenticadoDto;
}

@Injectable()
export default class RegistrarMembroGrupoUseCase {
  constructor(
    @InjectRepository(MembroGrupoTrabalhoEntity)
    private readonly membroGrupoRepository: Repository<MembroGrupoTrabalhoEntity>,
  ) {}

  public async registrar({ idCaso, membro, solicitante }: Request) {
    const identificador = uuid();

    const novoMembro = this.membroGrupoRepository.create({
      criador: {
        id: solicitante.id,
      },
      caso: {
        id: idCaso,
      },
      dataVinculo: new Date(),
      identificador,
      membro,
    });

    return this.membroGrupoRepository.save(novoMembro);
  }
}
