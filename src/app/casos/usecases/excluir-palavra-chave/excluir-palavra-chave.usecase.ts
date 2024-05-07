import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PalavraChaveEntity from '../../entities/palavra-chave.entity';
import AppException from '@/shared/exceptions/app-exception';
import { MensagensHelper } from '@/helpers/mensagens.helper';

export interface ExcluirPalavraChaveUsecaseRequest {
  idPalavraChave: number;
  idCaso: number;
}

@Injectable()
export class ExcluirPalavraChaveUsecase {
  constructor(
    @InjectRepository(PalavraChaveEntity)
    private readonly palavraChaveRepository: Repository<PalavraChaveEntity>,
  ) {}

  public async excluir({
    idPalavraChave,
    idCaso,
  }: ExcluirPalavraChaveUsecaseRequest) {
    const palavraChaveValida = await this.palavraChaveRepository.exists({
      where: {
        id: idPalavraChave,
        caso: {
          id: idCaso,
        },
      },
    });

    if (!palavraChaveValida) {
      throw new AppException(
        MensagensHelper.Casos.PALAVRA_CHAVE_NAO_ENCONTRADA,
      );
    }

    await this.palavraChaveRepository.delete(idPalavraChave);
  }
}
