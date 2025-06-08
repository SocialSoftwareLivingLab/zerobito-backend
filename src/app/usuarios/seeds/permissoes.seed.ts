import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import SeedRunner from '@/shared/seeds/seed-runner';
import { PermissaoEntity } from '../entities/permissao.entity';
import { PermissaoEnum } from '../enums/permissoes.enum';

const permissoes = [
  // Sistema/Administração
  {
    codigo: PermissaoEnum.SISTEMA_CRIAR_ADMIN,
    nome: 'Criar Administrador do Sistema',
    descricao: 'Permissão para criar novos administradores do sistema',
  },

  // Ocorrências
  {
    codigo: PermissaoEnum.OCORRENCIAS_VISUALIZAR,
    nome: 'Visualizar Ocorrências',
    descricao: 'Permissão para visualizar ocorrências do sistema',
  },
  {
    codigo: PermissaoEnum.OCORRENCIAS_CRIAR,
    nome: 'Criar Ocorrência',
    descricao: 'Permissão para criar novas ocorrências',
  },
  {
    codigo: PermissaoEnum.OCORRENCIAS_ACEITAR,
    nome: 'Aceitar Ocorrência',
    descricao: 'Permissão para aceitar uma ocorrência para virar caso',
  },
  {
    codigo: PermissaoEnum.OCORRENCIAS_NAO_INCORPORAR,
    nome: 'Não Incorporar Ocorrência',
    descricao: 'Permissão para marcar ocorrência como não incorporável',
  },

  // Casos - Visualização
  {
    codigo: PermissaoEnum.CASOS_VISUALIZAR_TODOS,
    nome: 'Visualizar Todos os Casos',
    descricao: 'Permissão para visualizar todos os casos criados',
  },

  // Casos - Dados Básicos
  {
    codigo: PermissaoEnum.CASOS_ALTERAR_DATA_OBITO,
    nome: 'Alterar Data do Óbito',
    descricao: 'Permissão para alterar a data de óbito do caso',
  },
  {
    codigo: PermissaoEnum.CASOS_ALTERAR_DATA_ACIDENTE,
    nome: 'Alterar Data do Acidente',
    descricao: 'Permissão para alterar a data do acidente do caso',
  },
  {
    codigo: PermissaoEnum.CASOS_DEFINIR_CAUSA_PRIMARIA,
    nome: 'Definir Causa Primária',
    descricao: 'Permissão para definir a causa primária do caso',
  },
  {
    codigo: PermissaoEnum.CASOS_DEFINIR_CAUSA_SECUNDARIA,
    nome: 'Definir Causa Secundária',
    descricao: 'Permissão para definir a causa secundária do caso',
  },
  {
    codigo: PermissaoEnum.CASOS_DEFINIR_DIAGNOSTICO,
    nome: 'Definir Diagnóstico',
    descricao: 'Permissão para definir o diagnóstico do caso',
  },
  {
    codigo: PermissaoEnum.CASOS_DEFINIR_COMENTARIOS,
    nome: 'Definir Comentários',
    descricao: 'Permissão para definir comentários do caso',
  },
  {
    codigo: PermissaoEnum.CASOS_DEFINIR_LOCALIZACAO,
    nome: 'Definir Localização',
    descricao: 'Permissão para definir a localização do caso',
  },

  // Casos - Configuração/Cadastros
  {
    codigo: PermissaoEnum.CASOS_CADASTRAR_CAUSAS,
    nome: 'Cadastrar Causas',
    descricao: 'Permissão para cadastrar novas causas para os casos',
  },
  {
    codigo: PermissaoEnum.CASOS_CADASTRAR_DIAGNOSTICOS,
    nome: 'Cadastrar Diagnósticos',
    descricao: 'Permissão para cadastrar novos diagnósticos dos casos',
  },

  // Casos - Notificações
  {
    codigo: PermissaoEnum.CASOS_VER_NOTIFICACOES,
    nome: 'Ver Notificações',
    descricao: 'Permissão para ver a tela de notificações do caso',
  },
  {
    codigo: PermissaoEnum.CASOS_REGISTRAR_NOTIFICACAO,
    nome: 'Registrar Notificação',
    descricao: 'Permissão para registrar uma nova notificação do caso',
  },
  {
    codigo: PermissaoEnum.CASOS_CADASTRAR_TIPOS_NOTIFICACAO,
    nome: 'Cadastrar Tipos de Notificação',
    descricao: 'Permissão para cadastrar tipos de notificações do caso',
  },

  // Casos - Membros/Equipe
  {
    codigo: PermissaoEnum.CASOS_ENVIAR_CONVITE_MEMBRO,
    nome: 'Enviar Convite para Membro',
    descricao: 'Permissão para enviar convite para um novo membro do caso',
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

