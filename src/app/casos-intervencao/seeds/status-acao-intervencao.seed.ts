import SeedRunner from '@/shared/seeds/seed-runner';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import StatusAcaoIntervencaoEntity from '../entities/status-acao-intervencao.entity';
import { Seed } from '@/shared/seeds/seed.decorator';
import { StatusAcaoIntervencaoEnum } from '../entities/status-acao-intervencao.enum';

interface StatusType {
  codigo: string;
  nome: string;
  descricao: string;
}

const status: StatusType[] = [
  {
    codigo: StatusAcaoIntervencaoEnum.PENDENTE,
    nome: 'Pendente',
    descricao: 'Ação está pendente de execução',
  },
  {
    codigo: StatusAcaoIntervencaoEnum.EM_ANDAMENTO,
    nome: 'Em andamento',
    descricao: 'Ação está sendo executada',
  },
  {
    codigo: StatusAcaoIntervencaoEnum.ATRASADA,
    nome: 'Atrasada',
    descricao: 'Ação passou do prazo previsto',
  },
  {
    codigo: StatusAcaoIntervencaoEnum.CANCELADA,
    nome: 'Cancelada',
    descricao: 'Ação foi cancelada',
  },
  {
    codigo: StatusAcaoIntervencaoEnum.CONCLUIDA,
    nome: 'Concluída',
    descricao: 'Ação foi concluída',
  },
];

@Seed()
@Injectable()
export default class StatusAcaoIntervencaoSeed implements SeedRunner {
  private readonly logger = new Logger(StatusAcaoIntervencaoSeed.name);

  constructor(
    @InjectRepository(StatusAcaoIntervencaoEntity)
    private readonly statusRepository: Repository<StatusAcaoIntervencaoEntity>,
  ) {}

  public async run() {
    this.logger.log("Seed da tabela 'intervencao_acao_status'...");
    await this.seedStatus();
  }

  private async seedStatus() {
    const quantidade = await this.statusRepository.count();

    if (quantidade > 0) return;

    this.logger.log(
      'Criando status de ação de intervenção',
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
