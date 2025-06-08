import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import SeedRunner from '@/shared/seeds/seed-runner';
import { PermissaoEntity } from '../entities/permissao.entity';

const permissoes = [
  {
    codigo: 'USERS_CREATE',
    nome: 'Criar Usuários',
    descricao: 'Permissão para criar novos usuários no sistema',
  },
  {
    codigo: 'USERS_READ',
    nome: 'Visualizar Usuários',
    descricao: 'Permissão para visualizar dados de usuários',
  },
  {
    codigo: 'USERS_UPDATE',
    nome: 'Atualizar Usuários',
    descricao: 'Permissão para atualizar dados de usuários',
  },
  {
    codigo: 'USERS_DELETE',
    nome: 'Excluir Usuários',
    descricao: 'Permissão para excluir usuários do sistema',
  },
  {
    codigo: 'CASES_CREATE',
    nome: 'Criar Casos',
    descricao: 'Permissão para criar novos casos',
  },
  {
    codigo: 'CASES_READ',
    nome: 'Visualizar Casos',
    descricao: 'Permissão para visualizar casos',
  },
  {
    codigo: 'CASES_UPDATE',
    nome: 'Atualizar Casos',
    descricao: 'Permissão para atualizar dados de casos',
  },
  {
    codigo: 'CASES_DELETE',
    nome: 'Excluir Casos',
    descricao: 'Permissão para excluir casos',
  },
  {
    codigo: 'CASES_COORDINATE',
    nome: 'Coordenar Casos',
    descricao: 'Permissão para coordenar casos e gerenciar equipes',
  },
  {
    codigo: 'OCCURRENCES_CREATE',
    nome: 'Criar Ocorrências',
    descricao: 'Permissão para criar novas ocorrências',
  },
  {
    codigo: 'OCCURRENCES_READ',
    nome: 'Visualizar Ocorrências',
    descricao: 'Permissão para visualizar ocorrências',
  },
  {
    codigo: 'OCCURRENCES_UPDATE',
    nome: 'Atualizar Ocorrências',
    descricao: 'Permissão para atualizar dados de ocorrências',
  },
  {
    codigo: 'OCCURRENCES_DELETE',
    nome: 'Excluir Ocorrências',
    descricao: 'Permissão para excluir ocorrências',
  },
];

@Injectable()
export default class PermissoesSeed implements SeedRunner {
  private readonly logger = new Logger(PermissoesSeed.name);

  constructor(
    @InjectRepository(PermissaoEntity)
    private readonly permissaoRepository: Repository<PermissaoEntity>,
  ) {}

  async run() {
    this.logger.log('Seed da tabela "permissao"...');

    const quantidade = await this.permissaoRepository.count();
    if (quantidade > 0) return;

    this.logger.log('Criando permissões básicas do sistema');

    for (const permissaoData of permissoes) {
      const permissao = this.permissaoRepository.create(permissaoData);
      await this.permissaoRepository.save(permissao);
      this.logger.log(`Permissão "${permissaoData.nome}" criada com sucesso`);
    }
  }
}
