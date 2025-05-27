import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import MembroGrupoTrabalhoEntity from '../../entities/membro-grupo.entity';

import { v4 as uuid } from 'uuid';
import StatusMembroGrupoTrabalhoEntity from '../../entities/status-membro.entity';
import { StatusMembroGrupoTrabalhoEnum } from '../../enum/status-membro.enum';
import AtaReuniaoEntity from '../../entities/ata-reuniao/ata-reuniao.entity';

export interface Request {
  idCaso: number;
  conteudo: string;
}

@Injectable()
export default class RegistrarAtaReuniaoUseCase {
  constructor(
    @InjectRepository(AtaReuniaoEntity)
    private readonly ataReuniaoRepository: Repository<AtaReuniaoEntity>,
  ) {}

  public async registrar({
    idCaso,
    conteudo
  }: Request) {
    const identificador = uuid();

    const novaAta = this.ataReuniaoRepository.create({
      caso: {
        id: idCaso,
      },
      data: new Date(),
      identificador,
      conteudo,
    });

    return this.ataReuniaoRepository.save(novaAta);
  }
}
