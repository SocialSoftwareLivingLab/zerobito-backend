import SeedRunner from '@/shared/seeds/seed-runner';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import StatusConclusaoAcaoIntervencaoEntity from '../entities/status-conclusao-acao-intervencao.entity';
import { Seed } from '@/shared/seeds/seed.decorator';
import { StatusConclusaoAcaoIntervencaoEnum } from '../entities/status-conclusao-acao-intervencao.enum';

interface StatusType {
  codigo: string;
  nome: string;
  descricao: string;
}

const status: StatusType[] = [
  {
    codigo: StatusConclusaoAcaoIntervencaoEnum.CONCLUIDA_EXITO,
    nome: 'Concluída com êxito',
    descricao: 'Ação foi concluída com êxito total',
  },
  {
    codigo: StatusConclusaoAcaoIntervencaoEnum.CONCLUIDA_SATISFATORIA,
    nome: 'Concluída satisfatória',
    descricao: 'Ação foi concluída de forma satisfatória',
  },
  {
    codigo: StatusConclusaoAcaoIntervencaoEnum.CONCLUIDA_PARCIAL,
    nome: 'Concluída parcial',
    descricao: 'Ação foi concluída parcialmente',
  },
  {
    codigo: StatusConclusaoAcaoIntervencaoEnum.NAO_CONCLUIDA,
    nome: 'Não concluída',
    descricao: 'Ação não foi concluída',
  },
];

@Seed()
@Injectable()
export default class StatusConclusaoAcaoIntervencaoSeed implements SeedRunner {
  private readonly logger = new Logger(StatusConclusaoAcaoIntervencaoSeed.name);

  constructor(
    @InjectRepository(StatusConclusaoAcaoIntervencaoEntity)
    private readonly statusRepository: Repository<StatusConclusaoAcaoIntervencaoEntity>,
  ) {}

  public async run() {
    this.logger.log("Seed da tabela 'intervencao_acao_conclusao_status'...");
    await this.seedStatus();
  }

  private async seedStatus() {
    const quantidade = await this.statusRepository.count();

    if (quantidade > 0) return;

    this.logger.log(
      'Criando status de conclusão de ação de intervenção',
    );

    for (const statusMapeado of status) {
      const statusEntity = this.statusRepository.create();
      statusEntity.codigo = statusMapeado.codigo;
      statusEntity.nome = statusMapeado.nome;
      statusEntity.descricao = statusMapeado.descricao;

      await this.statusRepository.save(statusEntity);
    }
  }
}
