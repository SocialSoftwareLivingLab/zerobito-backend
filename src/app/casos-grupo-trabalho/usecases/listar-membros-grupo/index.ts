import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import MembroGrupoTrabalhoEntity from '../../entities/membro-grupo.entity';
import { InjectRepository } from '@nestjs/typeorm';

export interface Request {
  idCaso: number;
}

export interface Response {}

@Injectable()
export default class ListarMembrosGrupoUsecase {
  private readonly logger = new Logger(ListarMembrosGrupoUsecase.name);

  constructor(
    @InjectRepository(MembroGrupoTrabalhoEntity)
    private readonly membrosGrupoTrabalhoRepository: Repository<MembroGrupoTrabalhoEntity>,
  ) {}

  public async listar(req: Request) {
    const { idCaso } = req;

    this.logger.log(
      `Pesquisando membros do grupo de trabalho para o caso ${idCaso}`,
    );

    const membros = await this.membrosGrupoTrabalhoRepository.find({
      where: {
        caso: {
          id: idCaso,
        },
      },
      relations: ['membro', 'status', 'criador', 'caso'],
    });

    return membros;
  }
}
