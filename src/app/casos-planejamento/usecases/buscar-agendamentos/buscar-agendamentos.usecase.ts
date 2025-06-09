
import { Injectable, Logger } from "@nestjs/common";
import { MoreThanOrEqual, MoreThan, Repository } from "typeorm";
import AgendamentoReuniaoEntity from "../../entities/agendamento-reuniao.entity";
import { InjectRepository } from "@nestjs/typeorm";
import ConsultarCasoPorIdUsecase from "@/app/casos/usecases/caso/consultar-casos/consultar-caso-by-id.usecase";
import AppException from "@/shared/exceptions/app-exception";
import { MensagensHelper } from "@/helpers/mensagens.helper";


export interface ReuniaoResponse{
  data: Date;
}

export interface BuscarAgendamentosReuniaoPlanejamentoUseCaseInput {
  idCaso: number;
}

export interface BuscarReuniaoUsecaseRequest {
  idCaso: number;
}

@Injectable()
export default class BuscarReuniaoUseCase {
  private readonly logger = new Logger(BuscarReuniaoUseCase.name);
  constructor(
    @InjectRepository(AgendamentoReuniaoEntity)
    private readonly agendamentoReuniaoRepository: Repository<AgendamentoReuniaoEntity>,
    private readonly consultarCasoByIdUsecase: ConsultarCasoPorIdUsecase,
  ) { }

  public async buscarTodos({idCaso}: BuscarReuniaoUsecaseRequest): Promise<ReuniaoResponse[]>  {
    
        const casoInformadoExiste = await this.consultarCasoByIdUsecase.casoExiste(idCaso);
    
        if (!casoInformadoExiste) {
          throw new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO);
        }
    
    
        const agendamentos = await this.agendamentoReuniaoRepository.find({
          where: {
            caso: {
              id: idCaso
            },
            data: MoreThanOrEqual(new Date())
          }
        });

        const reunioes: ReuniaoResponse[] = agendamentos.map((reuniao) => ({
                        data: reuniao.data
                }));

        return reunioes;
        }

  /**
   * Retorna lista de reuniões agendadas para o caso. Precisa receber um código de caso válido
   * 
   * @param param0 dados necessários para realizar a busca
   * @returns lista dos próximos agendamentos de reuniões, ordenados pela data ASC, ou seja, os que estão mais próximos tem maior prioridade.
   */
  public async buscarTodos({ idCaso }: BuscarAgendamentosReuniaoPlanejamentoUseCaseInput) {
    const casoExiste = await this.consultarCasoUsecase.casoExiste(idCaso);
    if (!casoExiste) {
      throw new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO);
    }

    const proximosAgendamentos = await this.agendamentoReuniaoRepository.find({
      where: {
        data: MoreThan(new Date())
      },
      order: {
        data: 'ASC'
      },
      relations: {
        solicitante: true
      }
    });

    return proximosAgendamentos;
  }

}