import { Inject, Injectable } from '@nestjs/common';
import RegistrarCasoUseCase from './usecases/registrar-caso/registrar-caso.usecase';
import { RegistrarCasoRequest } from './usecases/registrar-caso/registrar-caso.dto';

@Injectable()
export class CasosService {
  constructor(
    @Inject()
    private readonly registrarCasoUseCase: RegistrarCasoUseCase,
  ) {}

  public async registrarCaso(request: RegistrarCasoRequest) {
    return this.registrarCasoUseCase.executar(request);
  }
}
