import { Injectable } from '@nestjs/common';
import ConsultarCasoPorIdUsecase from '../../caso/consultar-casos/consultar-caso-by-id.usecase';
import AppException from '@/shared/exceptions/app-exception';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import { Repository } from 'typeorm';
import PalavraChaveEntity from '../../../entities/palavra-chave.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdicionarPalavraChaveUseCase {
  constructor(
    private readonly consultarCasoPorIdUsecase: ConsultarCasoPorIdUsecase,
    @InjectRepository(PalavraChaveEntity)
    private readonly palavraChaveRepository: Repository<PalavraChaveEntity>,
  ) {}

  public async adicionarPalavraChave(id: number, valor: string) {
    const resultado = await this.consultarCasoPorIdUsecase.buscarPorId(id);
    const caso = resultado.orElseThrow(
      () => new AppException(MensagensHelper.Casos.CASO_NAO_ENCONTRADO),
    );

    const palavraChave = this.palavraChaveRepository.create({
      valor,
      caso,
    });

    return await this.palavraChaveRepository.save(palavraChave);
  }
}
