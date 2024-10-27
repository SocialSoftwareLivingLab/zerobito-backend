import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import AgendamentoReuniaoEntity from "../../entities/agendamento-reuniao.entity";
import { InjectRepository } from "@nestjs/typeorm";


export interface BuscarAgendamentosReuniaoPlanejamentoUseCaseInput { }

@Injectable()
export default class BuscarAgendamentosReuniaoPlanejamentoUseCase {

  constructor(
    @InjectRepository(AgendamentoReuniaoEntity)
    private readonly agendamentoReuniaoRepository: Repository<AgendamentoReuniaoEntity>,
  ) { }

  public async buscarTodos() {
    // TO-DO...
  }

}