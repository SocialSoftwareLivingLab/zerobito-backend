import SeedRunner from '@/shared/seeds/seed-runner';
import { Repository } from 'typeorm';
import TipoNotificacaoEntity from '../entities/notificacao-tipo.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

const tiposNotificacoes = [
  { sigla: 'CAT*', descricao: 'CAT*' },
  { sigla: 'SINAN*', descricao: 'SINAN*' },
  { sigla: 'DO*', descricao: 'DO*' },
  { sigla: 'SIM*', descricao: 'SIM*' },
  { sigla: 'OUTROS', descricao: 'Outros' },
];

@Injectable()
export default class TipoNotificacaoSeed implements SeedRunner {
  private readonly logger = new Logger(TipoNotificacaoSeed.name);

  constructor(
    @InjectRepository(TipoNotificacaoEntity)
    private readonly tipoNotificacaoRepository: Repository<TipoNotificacaoEntity>,
  ) {}

  async run(): Promise<void> {
    this.logger.log('Seed da tabela "caso_notificacao_tipo"...');

    const quantidade = await this.tipoNotificacaoRepository.count();
    if (quantidade > 0) return;

    this.logger.log('Criando primeira listagem de tipos de notificações');

    for (const tipoNotificacaoMapeado of tiposNotificacoes) {
      const tipoNotificacaoEntity: TipoNotificacaoEntity =
        this.tipoNotificacaoRepository.create();
      tipoNotificacaoEntity.nome = tipoNotificacaoMapeado.descricao;
      tipoNotificacaoEntity.descricao = tipoNotificacaoMapeado.descricao;
      tipoNotificacaoEntity.dataCriacao = new Date();

      await this.tipoNotificacaoRepository.save(tipoNotificacaoEntity);
    }
  }
}
