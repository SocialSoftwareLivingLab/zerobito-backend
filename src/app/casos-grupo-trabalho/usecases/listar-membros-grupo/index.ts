import { Injectable, Logger } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import MembroGrupoTrabalhoEntity from '../../entities/membro-grupo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import ConviteGrupoTrabalhoEntity from '../../entities/convite/convite-membro.entity';
import { StatusConviteGrupoTrabalhoEnum } from '../../enum/status-convite.enum';

export interface Request {
  idCaso: number;
}

interface MembroResponse {
  id: number;
  identificador: string;
  instituicao: string;
  nome: string;
  email: string;
  status: {
    codigo: string;
    nome: string;
  };
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
          codigo: Not(StatusConviteGrupoTrabalhoEnum.ACEITADO),
        },
      },
      relations: ['status'],
    });

    const [membrosEncontrados, convitesEncontrados] = await Promise.all([
      membrosPromise,
      convitesPromise,
    ]);



    const membros = membrosEncontrados.map((membro) => {
      return {
        id: membro.id,
        email: membro.membro.email,
        nome: membro.membro.nome,
        instituicao: membro.instituicao,
        status: {
          codigo: membro.status.codigo,
          nome: membro.status.nome,
        },
      } as MembroResponse;
    });

    const convites = convitesEncontrados.map((convite) => {
      return {
        id: convite.id,
        email: convite.emailConvidado,
        nome: convite.nomeConvidado,
        instituicao: convite.instituicaoConvidado,
        identificador: convite.identificador,
        status: {
          codigo: convite.status.codigo,
          nome: convite.status.nome,
        },
      } as MembroResponse;
    });


    return {
      membros: [...membros, ...convites],
    } as Response;
  }
}
