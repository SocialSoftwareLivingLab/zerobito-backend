
import { Injectable, Logger } from "@nestjs/common";
import { MoreThanOrEqual, MoreThan, Repository } from "typeorm";
import AgendamentoReuniaoIntervencaoEntity from "../../entities/agendamento-reuniao.entity";
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
    @InjectRepository(AgendamentoReuniaoIntervencaoEntity)
    private readonly agendamentoReuniaoRepository: Repository<AgendamentoReuniaoIntervencaoEntity>,
    private readonly consultarCasoByIdUsecase: ConsultarCasoPorIdUsecase,
  ) { }


  /**
   * Retorna lista de reuniões agendadas para o caso. Precisa receber um código de caso válido
   * 
   * @param param0 dados necessários para realizar a busca
   * @returns lista dos próximos agendamentos de reuniões, ordenados pela data ASC, ou seja, os que estão mais próximos tem maior prioridade.
   */
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

}