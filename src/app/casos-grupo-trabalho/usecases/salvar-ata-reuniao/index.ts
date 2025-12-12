import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import MembroGrupoTrabalhoEntity from '../../entities/membro-grupo.entity';

import { v4 as uuid } from 'uuid';
import StatusMembroGrupoTrabalhoEntity from '../../entities/status-membro.entity';
import { StatusMembroGrupoTrabalhoEnum } from '../../enum/status-membro.enum';
import AtaReuniaoEntity from '../../../casos/entities/ata-reuniao/ata-reuniao.entity';
import AgendamentoReuniaoEntity from '@/app/casos-planejamento/entities/agendamento-reuniao.entity';

export interface Request {
  idCaso: number;
  conteudo: string;
  dataReuniao: string;
}

@Injectable()
export default class RegistrarAtaReuniaoUseCase {
  constructor(
    @InjectRepository(AtaReuniaoEntity)
    private readonly ataReuniaoRepository: Repository<AtaReuniaoEntity>,

    @InjectRepository(AgendamentoReuniaoEntity)
    private readonly reuniaoRepository: Repository<AgendamentoReuniaoEntity>,
  ) {}

  public async registrar({ idCaso, dataReuniao, conteudo }: Request) {
    // 1️⃣ Procurar a reunião pelo caso e data
    const reuniao = await this.reuniaoRepository.findOne({
      where: {
        caso: { id: idCaso },
        data: new Date(dataReuniao),
      },
    });

    if (!reuniao) {
      throw new Error('Reunião não encontrada para o caso e data informados.');
    }

    // 2️⃣ Procurar se já existe uma ata para essa reunião
    let ata = await this.ataReuniaoRepository.findOne({
      where: { reuniao: { id: reuniao.id } },
    });

    if (ata) {
      // 3️⃣ Atualiza a ata existente
      ata.conteudo = conteudo;
      return this.ataReuniaoRepository.save(ata);
    }

    // 4️⃣ Se não existir, cria uma nova
    ata = this.ataReuniaoRepository.create({
      caso: { id: idCaso },
      reuniao: { id: reuniao.id },
      data: new Date(),
      identificador: uuid(),
      conteudo,
    });

    return this.ataReuniaoRepository.save(ata);
  }
}
