import { Injectable, Logger } from '@nestjs/common';
import AgendarReuniaoUsecase from './usecases/agendar-reuniao/agendar-reuniao.usecase';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import BuscarReuniaoUseCase from './usecases/buscar-agendamentos/buscar-agendamentos.usecase';
import BuscarAgendamentosReuniaoPlanejamentoUseCase from './usecases/buscar-agendamentos/buscar-agendamentos.usecase';
import IniciarInvestigacaoUsecase from './usecases/iniciar-investigacao';
import { CasosInvestigacaoService } from '../casos-investigacao/caso-investigacao.service';
import { CasosService } from '../casos/services/casos.service';
import AppException from '@/shared/exceptions/app-exception';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import { StatusCasoEnum } from '../casos/entities/status-caso.enum';

@Injectable()
export class CasosPlanejamentoService {
  private readonly logger = new Logger(CasosPlanejamentoService.name);

  constructor(
    private readonly casoService: CasosService,
    private readonly agendarReuniaoUsecase: AgendarReuniaoUsecase,
    private readonly buscarReuniaoUseCase: BuscarReuniaoUseCase,
    private readonly buscarAgendamentosUsecase: BuscarAgendamentosReuniaoPlanejamentoUseCase,
    private readonly iniciarInvestigacaoUsecase: IniciarInvestigacaoUsecase,
    private readonly investigacaoService: CasosInvestigacaoService,
  ) {}

  public async agendarReuniaoPlanejamento(
    data: Date,
    idCaso: number,
    usuarioAutenticado: UsuarioAutenticadoDto,
  ) {
    await this.agendarReuniaoUsecase.executar({
      dataAgendamento: data,
      idCaso,
      solicitante: usuarioAutenticado,
    });
  }

  public async buscarReuniaoPlanejamento(idCaso: number) {
    const reunioes = await this.buscarReuniaoUseCase.buscarTodos({
      idCaso,
    });
    return reunioes;
  }

  public async iniciarInvestigacao(idCaso: number) {
    this.logger.log(`Iniciando investigação do caso ${idCaso}...`);

    try {
      // Inicializa os mapas de etapas

      const casoInformadoExiste = await this.casoService.buscarCasoEspecifico(
            idCaso,
      );
      
      if (!casoInformadoExiste) {
        throw new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO);
      }

      if(casoInformadoExiste.status === StatusCasoEnum.EM_PLANEJAMENTO){
        await this.investigacaoService.iniciarMapaEtapa(idCaso);
        this.logger.debug(`Mapas de etapas inicializados para o caso ${idCaso}.`);

        // Executa o caso de uso principal de investigação
        await this.iniciarInvestigacaoUsecase.IniciarInvestigacao({
          caso: { id: idCaso },
        });

        this.logger.log(`Investigação do caso ${idCaso} iniciada com sucesso.`);
      }
    } catch (error) {
      this.logger.error(
        `Erro ao iniciar investigação do caso ${idCaso}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error; // Repassa o erro se quiser que o controller trate
    }
  }
}
