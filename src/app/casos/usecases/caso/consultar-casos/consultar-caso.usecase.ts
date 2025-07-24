import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import CasoEntity from '../../../entities/caso.entity';
import MembroGrupoTrabalhoEntity from '@/app/casos-grupo-trabalho/entities/membro-grupo.entity';
 // ajuste o path

@Injectable()
export class ConsultarCasoUseCase {
  private readonly logger = new Logger(ConsultarCasoUseCase.name);
  constructor(
    @InjectRepository(CasoEntity)
    private readonly casoRepository: Repository<CasoEntity>,
    @InjectRepository(MembroGrupoTrabalhoEntity)
    private readonly membroRepoistory: Repository<MembroGrupoTrabalhoEntity>,
  ) {}

  // TODO: Criar retorno paginado
  public async buscarTodosSumarizado(membroId: number): Promise<CasoEntity[]> {
  // 1. Busca todos os casoIds onde o membro está relacionado
  const relacoes = await this.membroRepoistory.find({
    where: { membro: { id: membroId } },
    relations: ['caso'],
    select: {
      caso: {
        id: true,
      },
    },
  });

  const casoIds = relacoes.map(r => r.caso.id);

  if (casoIds.length === 0) {
    return [];
  }

  // 2. Busca os casos cujos IDs estão relacionados com o membro
  return this.casoRepository.find({
    where: { id: In(casoIds) },
    order: { id: 'asc' },
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
      nome: true,
      dataCriacao: true,
      dataObito: true,
      dataCaso: true,
      coordenador: {
        id: true,
        nome: true,
      },
      criador: {
        id: true,
        nome: true,
      },
      informacoesBasicas: {
        comentario: true,
        causaPrimaria: {
          id: true,
          nome: true,
        },
        causaSecundaria: {
          id: true,
          nome: true,
        },
        diagnostico: {
          id: true,
          nome: true,
        },
      },
    },
  });
}

}
