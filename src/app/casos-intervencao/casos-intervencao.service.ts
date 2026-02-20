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
import ListarAcoesCasoUseCase from './usecases/listar-acoes/listar-acoes-caso.usecase';
import ListarAcoesMembroUseCase from './usecases/listar-acoes/listar-acoes-membro.usecase';
import CriarAcaoIntervencaoUseCase from './usecases/criar-acao/criar-acao-intervencao.usecase';
import EditarAcaoIntervencaoUseCase from './usecases/editar-acao/editar-acao-intervencao.usecase';
import FinalizarIntervencaoUseCase from './usecases/finalizar-intervencao/finalizar-intervencao.usecase';
import { CriarAcaoIntervencaoRequest, EditarAcaoIntervencaoRequest } from './payloads/criar-editar-acao-intervencao.payload';

@Injectable()
export class CasosIntervencaoService {
  private readonly logger = new Logger(CasosIntervencaoService.name);

  constructor(
    private readonly casoService: CasosService,
    private readonly agendarReuniaoUsecase: AgendarReuniaoUsecase,
    private readonly buscarReuniaoUseCase: BuscarReuniaoUseCase,
    private readonly buscarAgendamentosUsecase: BuscarAgendamentosReuniaoPlanejamentoUseCase,
    private readonly iniciarInvestigacaoUsecase: IniciarInvestigacaoUsecase,
    private readonly investigacaoService: CasosInvestigacaoService,
    private readonly listarAcoesCasoUseCase: ListarAcoesCasoUseCase,
    private readonly listarAcoesMembroUseCase: ListarAcoesMembroUseCase,
    private readonly criarAcaoIntervencaoUseCase: CriarAcaoIntervencaoUseCase,
    private readonly editarAcaoIntervencaoUseCase: EditarAcaoIntervencaoUseCase,
    private readonly finalizarIntervencaoUseCase: FinalizarIntervencaoUseCase,
  ) {}

  public async agendarReuniaoIntervencao(
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

  public async buscarReuniaoIntervencao(idCaso: number) {
    const reunioes = await this.buscarReuniaoUseCase.buscarTodos({
      idCaso,
    });
    return reunioes;
  }

  public async listarAcoesCaso(idCaso: number) {
    return await this.listarAcoesCasoUseCase.executar(idCaso);
  }

  public async listarAcoesMembro(idCaso: number, idMembro: number) {
    return await this.listarAcoesMembroUseCase.executar(idCaso, idMembro);
  }

  public async criarAcao(idCaso: number, payload: CriarAcaoIntervencaoRequest) {
    return await this.criarAcaoIntervencaoUseCase.executar(idCaso, payload);
  }

  public async editarAcao(idCaso: number, idAcao: number, payload: EditarAcaoIntervencaoRequest) {
    return await this.editarAcaoIntervencaoUseCase.executar(idCaso, idAcao, payload);
  }

  public async finalizarIntervencao(idCaso: number) {
    return await this.finalizarIntervencaoUseCase.executar(idCaso);
  }

  public async iniciarIntervencao(idCaso: number) {
    this.logger.log(`Iniciando intervenção do caso ${idCaso}...`);

    try {
      const casoInformadoExiste = await this.casoService.buscarCasoEspecifico(
            idCaso,
      );
      
      if (!casoInformadoExiste) {
        throw new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO);
      }

      // Verifica se o caso está em INVESTIGACAO antes de iniciar intervenção
      if(casoInformadoExiste.status !== StatusCasoEnum.EM_INVESTIGACAO){
        throw new AppException('Caso precisa estar em INVESTIGACAO para iniciar INTERVENCAO');
      }

      // Atualiza o status do caso para EM_INTERVENCAO
      await this.casoService.atualizarStatus(idCaso, StatusCasoEnum.EM_INTERVENCAO);
      
      this.logger.log(`Intervenção do caso ${idCaso} iniciada com sucesso.`);
    } catch (error) {
      this.logger.error(
        `Erro ao iniciar intervenção do caso ${idCaso}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
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
