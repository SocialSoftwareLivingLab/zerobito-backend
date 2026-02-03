import SeedRunner from '@/shared/seeds/seed-runner';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import TipoAcaoIntervencaoEntity from '../entities/tipo-acao-intervencao.entity';
import { Seed } from '@/shared/seeds/seed.decorator';
import { TipoAcaoIntervencaoEnum } from '../entities/tipo-acao-intervencao.enum';

interface TipoType {
  codigo: string;
  nome: string;
  descricao: string;
}

const tipos: TipoType[] = [
  {
    codigo: TipoAcaoIntervencaoEnum.FORMACAO,
    nome: 'Formação',
    descricao: 'Ação de formação e capacitação',
  },
  {
    codigo: TipoAcaoIntervencaoEnum.AJUDA_CASO,
    nome: 'Ajuda ao caso',
    descricao: 'Ação de apoio direto ao caso',
  },
  {
    codigo: TipoAcaoIntervencaoEnum.MONITORAMENTO,
    nome: 'Monitoramento',
    descricao: 'Ação de monitoramento e acompanhamento',
  },
  {
    codigo: TipoAcaoIntervencaoEnum.REUNIAO,
    nome: 'Reunião',
    descricao: 'Ação de reunião com partes envolvidas',
  },
  {
    codigo: TipoAcaoIntervencaoEnum.VISITA_TECNICA,
    nome: 'Visita técnica',
    descricao: 'Ação de visita técnica ao local',
  },
  {
    codigo: TipoAcaoIntervencaoEnum.OUTRO,
    nome: 'Outro',
    descricao: 'Outro tipo de ação',
  },
];

@Seed()
@Injectable()
export default class TipoAcaoIntervencaoSeed implements SeedRunner {
  private readonly logger = new Logger(TipoAcaoIntervencaoSeed.name);

  constructor(
    @InjectRepository(TipoAcaoIntervencaoEntity)
    private readonly tipoRepository: Repository<TipoAcaoIntervencaoEntity>,
  ) {}

  public async run() {
    this.logger.log("Seed da tabela 'intervencao_acao_tipo'...");
    await this.seedTipos();
  }

  private async seedTipos() {
    const quantidade = await this.tipoRepository.count();

    if (quantidade > 0) return;

    this.logger.log(
      'Criando tipos de ação de intervenção',
    );

    for (const tipoMapeado of tipos) {
      const tipoEntity = this.tipoRepository.create();
      tipoEntity.codigo = tipoMapeado.codigo;
      tipoEntity.nome = tipoMapeado.nome;
      tipoEntity.descricao = tipoMapeado.descricao;

      await this.tipoRepository.save(tipoEntity);
    }
  }
}
