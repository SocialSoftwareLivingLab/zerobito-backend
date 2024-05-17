import { MensagensHelper } from '@/helpers/mensagens.helper';
import AppException from '@/shared/exceptions/app-exception';
import { Injectable } from '@nestjs/common';
import CasoEntity from '../entities/caso.entity';
import { CasoResponse } from '../payloads/caso/caso.payload';
import { CausaApiResponse } from '../payloads/caso/causa.payload';
import { DiagnosticoApiResponse } from '../payloads/caso/diagnostico.payload';
import { EditarInformacoesBasicasRequest } from '../payloads/caso/informacoes-basicas.payload';
import { AdicionarOcorrenciaAoCasoUseCaseInput } from '../usecases/caso/adicionar-ocorrencia/adicionar-ocorrencia.dto';
import { AdicionarOcorrenciaAoCasoUseCase } from '../usecases/caso/adicionar-ocorrencia/adicionar-ocorrencia.usecase';
import AtualizarInformacoesBasicasCasoUsecase from '../usecases/caso/atualizar-informacoes-basicas/atualizar-informacoes-basicas.usecase';
import ConsultarCasoPorIdUsecase from '../usecases/caso/consultar-casos/consultar-caso-by-id.usecase';
import { ConsultarCasoUseCase } from '../usecases/caso/consultar-casos/consultar-caso.usecase';
import { RegistrarCasoRequest } from '../usecases/caso/registrar-caso/registrar-caso.dto';
import { RegistrarCasoUseCase } from '../usecases/caso/registrar-caso/registrar-caso.usecase';
import ConsultarCausaUsecase from '../usecases/causa/consultar-causa/consultar-causa.usecase';
import ConsultarDiagnosticoUsecase from '../usecases/diagnostico/consultar-diagnostico/consultar-diagnostico.usecase';

@Injectable()
export class CasosService {
  constructor(
    private readonly registrarCasoUseCase: RegistrarCasoUseCase,
    private readonly consultarCasoUseCase: ConsultarCasoUseCase,
    private readonly consultarCasoPorIdUsecase: ConsultarCasoPorIdUsecase,
    private readonly adicionarOcorrenciaAoCasoUseCase: AdicionarOcorrenciaAoCasoUseCase,
    private readonly atualizarInformacoesBasicasCasoUsecase: AtualizarInformacoesBasicasCasoUsecase,
    private readonly consultarCausaUsecase: ConsultarCausaUsecase,
    private readonly consultarDiagnosticoUseCase: ConsultarDiagnosticoUsecase,
  ) {}

  public async registrarCaso(request: RegistrarCasoRequest) {
    return this.registrarCasoUseCase.executar(request);
  }

  public async adicionarOcorrenciaAoCaso(
    data: AdicionarOcorrenciaAoCasoUseCaseInput,
  ) {
    await this.adicionarOcorrenciaAoCasoUseCase.adicionar(data);
  }

  public async buscarTodosSumarizado() {
    const resultado = await this.consultarCasoUseCase.buscarTodosSumarizado();
    return resultado.map((caso) => this.toResponse(caso));
  }

  public async buscarCasoEspecifico(id: number) {
    const resultadoConsulta =
      await this.consultarCasoPorIdUsecase.buscarPorId(id);

    const casoEncontrado = resultadoConsulta.orElseThrow(
      () => new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO),
    );

    return this.toResponse(casoEncontrado);
  }

  public async editarInformacoesBasicas(
    id: number,
    request: EditarInformacoesBasicasRequest,
  ) {
    await this.atualizarInformacoesBasicasCasoUsecase.executar({
      id,
      dados: request,
    });
  }

  public async listarTodasAsCausas() {
    const response = await this.consultarCausaUsecase.listarTodos();

    return response.map((causa) => {
      const causaResponse = new CausaApiResponse();
      causaResponse.codigo = causa.codigo;
      causaResponse.nome = causa.nome;

      return causaResponse;
    });
  }

  public async listarTodosDiagnosticos() {
    const response = await this.consultarDiagnosticoUseCase.listarTodos();

    return response.map((diagnostico) => {
      const diagnosticoResponse = new DiagnosticoApiResponse();
      diagnosticoResponse.codigo = diagnostico.codigo;
      diagnosticoResponse.nome = diagnostico.nome;

      return diagnosticoResponse;
    });
  }

  private toResponse(caso: CasoEntity) {
    const response = new CasoResponse();
    response.id = caso.id;
    response.nome = caso.nome;
    response.dataCriacao = caso.dataCriacao;
    response.criador = {
      id: caso.criador.id,
      nome: caso.criador.nome,
    };
    response.coordenador = {
      id: caso.coordenador.id,
      nome: caso.coordenador.nome,
    };
    response.informacoesBasicas = {
      comentario: caso.informacoesBasicas?.comentario,
      causaPrimaria: caso.informacoesBasicas?.causaPrimaria?.nome || null,
      causaSecundaria: caso.informacoesBasicas?.causaSecundaria?.nome || null,
      diagnostico: caso.informacoesBasicas?.diagnostico?.nome || null,
    };

    return response;
  }
}
