import { Injectable } from '@nestjs/common';
import { ConsultarCoordenadoresFiltroDto } from './dtos/consultar-coordenadores-filtro.dto';
import { BuscarCoordenadorUseCase } from './usecases/buscar-coordenador/buscar-coordenador.usecase';

@Injectable()
export class CoordenadoresService {
  constructor(
    private readonly buscarCoordenadorUseCase: BuscarCoordenadorUseCase,
  ) {}

  public buscarCoordenadores({ nome }: ConsultarCoordenadoresFiltroDto) {
    return this.buscarCoordenadorUseCase.buscarPorFiltro({ nome });
  }

  public async buscarCoordenadorPorId(id: number) {
    return this.buscarCoordenadorUseCase.buscarPorId(id);
  }
}
