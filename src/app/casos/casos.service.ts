import { Injectable } from '@nestjs/common';
import { RegistrarCasoRequest } from './usecases/registrar-caso/registrar-caso.dto';
import { RegistrarCasoUseCase } from './usecases/registrar-caso/registrar-caso.usecase';

@Injectable()
export class CasosService {
  constructor(private readonly registrarCasoUseCase: RegistrarCasoUseCase) {}

  public async registrarCaso(request: RegistrarCasoRequest) {
    return this.registrarCasoUseCase.executar(request);
  }
}
