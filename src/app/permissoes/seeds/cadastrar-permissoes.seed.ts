import SeedRunner from '@/shared/seeds/seed-runner';
import { Repository } from 'typeorm';
import { PermissaoEntity } from '../entities/permissao.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { PermissoesEnum } from '../permissoes.enum';

@Injectable()
export default class CadastrarPermissoesSeed implements SeedRunner {
  private readonly logger = new Logger(CadastrarPermissoesSeed.name);

  constructor(
    @InjectRepository(PermissaoEntity)
    private readonly permissoesRepository: Repository<PermissaoEntity>,
  ) {}

  public async run(): Promise<void> {
    const quantidadeRegistros: number = await this.permissoesRepository.count();

    if (quantidadeRegistros > 0) return;

    this.logger.log('Inserindo permissões no banco de dados...');

    const permissoesParaSalvar = Object.keys(PermissoesEnum)
      .map((permissao) => {
        return {
          sigla: permissao,
          descricao: PermissoesEnum[permissao],
        };
      })
      .map((permissao) => this.permissoesRepository.create(permissao));

    await this.permissoesRepository.save(permissoesParaSalvar);

    this.logger.log('Permissões inseridas com sucesso!');
  }
}
