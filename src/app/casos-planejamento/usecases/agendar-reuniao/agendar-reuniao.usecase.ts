import { UsuarioAutenticadoDto } from "@/auth/dtos/usuario-autenticado.dto";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import AgendamentoReuniaoEntity from "../../entities/agendamento-reuniao.entity";
import { InjectRepository } from "@nestjs/typeorm";
import AppException from "@/shared/exceptions/app-exception";
import { MensagensHelper } from "@/helpers/mensagens.helper";

export interface AgendarReuniaoUsecaseRequest {
  data: Date;
  idCaso: number;
  solicitante: UsuarioAutenticadoDto;
}

@Injectable()
export default class AgendarReuniaoUsecase {

  constructor(
    @InjectRepository(AgendamentoReuniaoEntity)
    private readonly agendamentoReuniaoRepository: Repository<AgendamentoReuniaoEntity>
  ) { }

  public async executar({ data, idCaso, solicitante }: AgendarReuniaoUsecaseRequest): Promise<void> {

    const existeAgendamentoJaMarcado = await this.agendamentoReuniaoRepository.find({
      where: {
        data,
        caso: {
          id: idCaso
        },
      }
    });

    if (existeAgendamentoJaMarcado && existeAgendamentoJaMarcado.length > 0) {
      throw new AppException(MensagensHelper.CasosAgendamentoReuniaoPreparacao.HORARIO_JA_POSSUI_REUNIAO);
    }

    const agendamentoParaSalvar = this.agendamentoReuniaoRepository.create({
      data,
      caso: { id: idCaso },
      solicitante: {
        id: solicitante.id
      },
      dataCriacao: new Date()
    })

    await this.agendamentoReuniaoRepository.save(agendamentoParaSalvar);
  }

}