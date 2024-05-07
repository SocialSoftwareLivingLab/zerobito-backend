import { Injectable } from '@nestjs/common';
import { AdicionarOcorrenciaAoCasoUseCaseInput } from './usecases/adicionar-ocorrencia/adicionar-ocorrencia.dto';
import { AdicionarOcorrenciaAoCasoUseCase } from './usecases/adicionar-ocorrencia/adicionar-ocorrencia.usecase';
import { RegistrarCasoRequest } from './usecases/registrar-caso/registrar-caso.dto';
import { RegistrarCasoUseCase } from './usecases/registrar-caso/registrar-caso.usecase';
import { ConsultarCasoUseCase } from './usecases/consultar-casos/consultar-caso.usecase';
import CasoEntity from './entities/caso.entity';
import { CasoResponse } from './payloads/caso/caso.payload';

@Injectable()
export class CasosService {
  constructor(
    private readonly registrarCasoUseCase: RegistrarCasoUseCase,
    private readonly adicionarOcorrenciaAoCasoUseCase: AdicionarOcorrenciaAoCasoUseCase,
    private readonly consultarCasoUseCase: ConsultarCasoUseCase,
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
