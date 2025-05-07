import { Injectable, Logger } from "@nestjs/common";
import { MoreThanOrEqual, Repository } from "typeorm";
import AgendamentoReuniaoEntity from "../../entities/agendamento-reuniao.entity";
import { InjectRepository } from "@nestjs/typeorm";
import ConsultarCasoPorIdUsecase from "@/app/casos/usecases/caso/consultar-casos/consultar-caso-by-id.usecase";
import AppException from "@/shared/exceptions/app-exception";
import { MensagensHelper } from "@/helpers/mensagens.helper";


export interface ReuniaoResponse{
  data: Date;
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

        return reunioes 
  }

}