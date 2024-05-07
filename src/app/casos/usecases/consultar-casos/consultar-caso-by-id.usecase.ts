import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import CasoEntity from '../../entities/caso.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Optional } from 'typescript-optional';

const relationsPadroes = [
  'coordenador',
  'criador',
  'informacoesBasicas',
  'informacoesBasicas.causaPrimaria',
  'informacoesBasicas.causaSecundaria',
  'informacoesBasicas.diagnostico',
];

@Injectable()
export default class ConsultarCasoPorIdUsecase {
  constructor(
    @InjectRepository(CasoEntity)
    private readonly casoRepository: Repository<CasoEntity>,
  ) {}

  public async buscarPorId(id: number): Promise<Optional<CasoEntity>> {
    const resultado = await this.casoRepository.findOne({
      where: { id },
      relations: relationsPadroes,
    });
    return Optional.ofNullable(resultado);
  }
}
