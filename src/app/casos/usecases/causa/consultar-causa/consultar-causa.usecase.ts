import CausaEntity from '@/app/casos/entities/info-basicas/causa.entity';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import AppException from '@/shared/exceptions/app-exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export default class ConsultarCausaUsecase {
  constructor(
    @InjectRepository(CausaEntity)
    private readonly causaRepository: Repository<CausaEntity>,
  ) {}

  public async consultar(codigo: string): Promise<CausaEntity> {
    try {
      const response = await this.causaRepository.findOneByOrFail({
        codigo,
      });

      return response;
    } catch {
      throw new AppException(MensagensHelper.Casos.CAUSA_NAO_ENCONTRADA);
    }
  }

  public async listarTodos() {
    return await this.causaRepository.find();
  }
}
