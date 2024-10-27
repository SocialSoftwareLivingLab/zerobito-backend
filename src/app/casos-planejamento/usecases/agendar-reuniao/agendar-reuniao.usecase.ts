import { UsuarioAutenticadoDto } from "@/auth/dtos/usuario-autenticado.dto";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import AgendamentoReuniaoEntity from "../../entities/agendamento-reuniao.entity";
import { InjectRepository } from "@nestjs/typeorm";
import AppException from "@/shared/exceptions/app-exception";
import { MensagensHelper } from "@/helpers/mensagens.helper";
import ConsultarCasoPorIdUsecase from "@/app/casos/usecases/caso/consultar-casos/consultar-caso-by-id.usecase";
import { isAfter } from "date-fns";

export interface AgendarReuniaoUsecaseRequest {
  dataAgendamento: Date;
  idCaso: number;
  solicitante: UsuarioAutenticadoDto;
}

@Injectable()
export default class AgendarReuniaoUsecase {

  constructor(
    @InjectRepository(AgendamentoReuniaoEntity)
    private readonly agendamentoReuniaoRepository: Repository<AgendamentoReuniaoEntity>,
    private readonly consultarCasoByIdUsecase: ConsultarCasoPorIdUsecase,
  ) { }

  public async executar({ dataAgendamento, idCaso, solicitante }: AgendarReuniaoUsecaseRequest): Promise<void> {

    const casoInformadoExiste = await this.consultarCasoByIdUsecase.casoExiste(idCaso);

    if (!casoInformadoExiste) {
      throw new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO);
    }

    const isDataAgendamentoValida = isAfter(dataAgendamento, new Date());

    if (!isDataAgendamentoValida) {
      throw new AppException(MensagensHelper.CasosAgendamentoReuniaoPreparacao.HORARIO_INVALIDO_PARA_AGENDAMENTO);
    }

    const existeAgendamentoJaMarcado = await this.agendamentoReuniaoRepository.find({
      where: {
        data: dataAgendamento,
        caso: {
          id: idCaso
        },
      }
    });

    if (existeAgendamentoJaMarcado && existeAgendamentoJaMarcado.length > 0) {
      throw new AppException(MensagensHelper.CasosAgendamentoReuniaoPreparacao.HORARIO_JA_POSSUI_REUNIAO);
    }

    const agendamentoParaSalvar = this.agendamentoReuniaoRepository.create({
      data: dataAgendamento,
      caso: { id: idCaso },
      solicitante: {
        id: solicitante.id
      },
      dataCriacao: new Date()
    })

    await this.agendamentoReuniaoRepository.save(agendamentoParaSalvar);
  }

}