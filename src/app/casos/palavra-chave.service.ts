import { Injectable } from '@nestjs/common';
import { PalavraChaveResponse } from './payloads/palavra-chave/palavra-chave.payload';
import { AdicionarPalavraChaveUseCase } from './usecases/adicionar-palavra-chave/adicionar-palavra-chave.usecase';
import { BuscarPalavrasChaveUsecase } from './usecases/buscar-palavras-chave/buscar-palavras-chave.usecase';
import { ExcluirPalavraChaveUsecase } from './usecases/excluir-palavra-chave/excluir-palavra-chave.usecase';
import PalavraChaveEntity from './entities/palavra-chave.entity';

@Injectable()
export class PalavraChaveService {
  constructor(
    private readonly adicionarPalavraChaveUsecase: AdicionarPalavraChaveUseCase,
    private readonly buscarPalavrasChaveUsecase: BuscarPalavrasChaveUsecase,
    private readonly excluirPalavraChaveUsecase: ExcluirPalavraChaveUsecase,
  ) {}

  public async buscar(idCaso: number) {
    const response = await this.buscarPalavrasChaveUsecase.buscar(idCaso);

    return response.map((entity) => this.toResponse(entity));
  }

  public async cadastrarNovaPalavraChave(idCaso: number, palavraChave: string) {
    const response =
      await this.adicionarPalavraChaveUsecase.adicionarPalavraChave(
        idCaso,
        palavraChave,
      );

    return this.toResponse(response);
  }

  public async excluirPalavraChave(idCaso: number, idPalavraChave: number) {
    await this.excluirPalavraChaveUsecase.excluir({
      idCaso,
      idPalavraChave,
    });
  }

  private toResponse(entity: PalavraChaveEntity) {
    const response = new PalavraChaveResponse();
    response.id = entity.id;
    response.valor = entity.valor;

    return response;
  }
}
