import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import CasoEntity from '../../../entities/caso.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ConsultarCasoUseCase {
  constructor(
    @InjectRepository(CasoEntity)
    private readonly casoRepository: Repository<CasoEntity>,
  ) {}

  // TODO: Criar retorno paginado
  public async buscarTodosSumarizado(): Promise<CasoEntity[]> {
    return await this.casoRepository.find({
      order: {
        id: 'asc',
      },
      relations: [
        'coordenador',
        'criador',
        'informacoesBasicas',
        'informacoesBasicas.causaPrimaria',
        'informacoesBasicas.causaSecundaria',
        'informacoesBasicas.diagnostico',
      ],
      select: {
        id: true,
        coordenador: {
          id: true,
          nome: true,
        },
        criador: {
          id: true,
          nome: true,
        },
        dataCriacao: true,
        nome: true,
        informacoesBasicas: {
          causaPrimaria: {
            id: true,
            nome: true,
          },
          causaSecundaria: {
            id: true,
            nome: true,
          },
          comentario: true,
          diagnostico: {
            id: true,
            nome: true,
          },
        },
      },
    });
  }
}
