import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import MembroGrupoTrabalhoEntity from '../../entities/membro-grupo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import ConviteGrupoTrabalhoEntity from '../../entities/convite/convite-membro.entity';
import { StatusConviteGrupoTrabalhoEnum } from '../../enum/status-convite.enum';

export interface Request {
  idCaso: number;
}

interface MembroResponse {
  identificador: string;
  nome: string;
  email: string;
  status: string;
}

export interface Response {
  membros: MembroResponse[];
}

@Injectable()
export default class ListarMembrosGrupoUsecase {
  private readonly logger = new Logger(ListarMembrosGrupoUsecase.name);

  constructor(
    @InjectRepository(MembroGrupoTrabalhoEntity)
    private readonly membrosGrupoTrabalhoRepository: Repository<MembroGrupoTrabalhoEntity>,
    @InjectRepository(ConviteGrupoTrabalhoEntity)
    private readonly convitesGrupoRepository: Repository<ConviteGrupoTrabalhoEntity>,
  ) {}

  public async listar(req: Request) {
    const { idCaso } = req;

    this.logger.log(
      `Pesquisando membros do grupo de trabalho para o caso ${idCaso}`,
    );

    const membrosPromise = this.membrosGrupoTrabalhoRepository.find({
      where: {
        caso: {
          id: idCaso,
        },
      },
      relations: ['membro', 'status', 'criador', 'caso'],
    });

    const convitesPromise = this.convitesGrupoRepository.find({
      where: {
        caso: {
          id: idCaso,
        },
        status: {
          codigo: StatusConviteGrupoTrabalhoEnum.PENDENTE,
        },
      },
    });

    const [membrosEncontrados, convitesEncontrados] = await Promise.all([
      membrosPromise,
      convitesPromise,
    ]);

    const membros = membrosEncontrados.map((membro) => {
      return {
        email: membro.membro.email,
        nome: membro.membro.nome,
        identificador: membro.identificador,
        status: membro.status.nome,
      } as MembroResponse;
    });

    const convites = convitesEncontrados.map((convite) => {
      return {
        email: convite.emailConvidado,
        nome: convite.nomeConvidado,
        identificador: convite.identificador,
        status: convite.status.nome,
      } as MembroResponse;
    });

    return {
      membros: [...membros, ...convites],
    } as Response;
  }
}
