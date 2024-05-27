import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import PalavraChaveEntity from '../../../entities/palavra-chave.entity';
import { InjectRepository } from '@nestjs/typeorm';
import ConsultarCasoPorIdUsecase from '../../caso/consultar-casos/consultar-caso-by-id.usecase';
import AppException from '@/shared/exceptions/app-exception';
import { MensagensHelper } from '@/helpers/mensagens.helper';

@Injectable()
export class BuscarPalavrasChaveUsecase {
  constructor(
    @InjectRepository(PalavraChaveEntity)
    private readonly palavraChaveRepository: Repository<PalavraChaveEntity>,
    private readonly consultarCasoPorIdUsecase: ConsultarCasoPorIdUsecase,
  ) {}

  public async buscar(idCaso: number) {
    const consultaCaso =
      await this.consultarCasoPorIdUsecase.buscarPorId(idCaso);

    const casoEncontrado = consultaCaso.orElseThrow(
      () => new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO),
    );

    return this.palavraChaveRepository.find({
      where: {
        caso: {
          id: casoEncontrado.id,
        },
      },
    });
  }
}
