import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import MembroGrupoTrabalhoEntity from "../../entities/membro-grupo.entity";
import { InjectRepository } from "@nestjs/typeorm";

export interface Request {
  idCaso: number;
}

export interface Response {

}

@Injectable()
export default class ListarMembrosGrupoUsecase {

  constructor(
    @InjectRepository(MembroGrupoTrabalhoEntity)
    private readonly membrosGrupoTrabalhoRepository: Repository<MembroGrupoTrabalhoEntity>
  ) {}

  public async listar(req: Request) {
    const { idCaso } = req;

    const membros = await this.membrosGrupoTrabalhoRepository.find({
      where: {
        caso: {
          id: idCaso
        }
      },
      relations: ['membro', 'status', 'criador']
    });

    return membros;
  }
}