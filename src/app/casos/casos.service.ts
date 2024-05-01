import { Injectable } from '@nestjs/common';
import { AdicionarOcorrenciaAoCasoUseCaseInput } from './usecases/adicionar-ocorrencia/adicionar-ocorrencia.dto';
import { AdicionarOcorrenciaAoCasoUseCase } from './usecases/adicionar-ocorrencia/adicionar-ocorrencia.usecase';
import { RegistrarCasoRequest } from './usecases/registrar-caso/registrar-caso.dto';
import { RegistrarCasoUseCase } from './usecases/registrar-caso/registrar-caso.usecase';

@Injectable()
export class CasosService {
  constructor(
    private readonly registrarCasoUseCase: RegistrarCasoUseCase,
    private readonly adicionarOcorrenciaAoCasoUseCase: AdicionarOcorrenciaAoCasoUseCase,
  ) {}

  public async registrarCaso(request: RegistrarCasoRequest) {
    return this.registrarCasoUseCase.executar(request);
  }

  public async adicionarOcorrenciaAoCaso(
    data: AdicionarOcorrenciaAoCasoUseCaseInput,
  ) {
    await this.adicionarOcorrenciaAoCasoUseCase.adicionar(data);
  }
}
