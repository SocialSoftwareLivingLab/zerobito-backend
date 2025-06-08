import { PermissaoEnum } from '../enums/permissoes.enum';

/**
 * Constantes das permissões do sistema organizadas por módulos funcionais
 * Baseado nos requisitos específicos do sistema
 */
export const PERMISSOES = {
  // Sistema/Administração
  SISTEMA: {
    CRIAR_ADMIN: PermissaoEnum.SISTEMA_CRIAR_ADMIN,
  },

  // Ocorrências
  OCORRENCIAS: {
    VISUALIZAR: PermissaoEnum.OCORRENCIAS_VISUALIZAR,
    CRIAR: PermissaoEnum.OCORRENCIAS_CRIAR,
    ACEITAR: PermissaoEnum.OCORRENCIAS_ACEITAR,
    NAO_INCORPORAR: PermissaoEnum.OCORRENCIAS_NAO_INCORPORAR,
  },

  // Casos
  CASOS: {
    // Visualização
    VISUALIZAR_TODOS: PermissaoEnum.CASOS_VISUALIZAR_TODOS,

    // Dados Básicos
    ALTERAR_DATA_OBITO: PermissaoEnum.CASOS_ALTERAR_DATA_OBITO,
    ALTERAR_DATA_ACIDENTE: PermissaoEnum.CASOS_ALTERAR_DATA_ACIDENTE,
    DEFINIR_CAUSA_PRIMARIA: PermissaoEnum.CASOS_DEFINIR_CAUSA_PRIMARIA,
    DEFINIR_CAUSA_SECUNDARIA: PermissaoEnum.CASOS_DEFINIR_CAUSA_SECUNDARIA,
    DEFINIR_DIAGNOSTICO: PermissaoEnum.CASOS_DEFINIR_DIAGNOSTICO,
    DEFINIR_COMENTARIOS: PermissaoEnum.CASOS_DEFINIR_COMENTARIOS,
    DEFINIR_LOCALIZACAO: PermissaoEnum.CASOS_DEFINIR_LOCALIZACAO,

    // Configuração/Cadastros
    CADASTRAR_CAUSAS: PermissaoEnum.CASOS_CADASTRAR_CAUSAS,
    CADASTRAR_DIAGNOSTICOS: PermissaoEnum.CASOS_CADASTRAR_DIAGNOSTICOS,

    // Notificações
    VER_NOTIFICACOES: PermissaoEnum.CASOS_VER_NOTIFICACOES,
    REGISTRAR_NOTIFICACAO: PermissaoEnum.CASOS_REGISTRAR_NOTIFICACAO,
    CADASTRAR_TIPOS_NOTIFICACAO:
      PermissaoEnum.CASOS_CADASTRAR_TIPOS_NOTIFICACAO,

    // Membros/Equipe
    ENVIAR_CONVITE_MEMBRO: PermissaoEnum.CASOS_ENVIAR_CONVITE_MEMBRO,
  },
} as const;

/**
 * Lista plana de todas as permissões para facilitar validações
 */
export const TODAS_PERMISSOES = Object.values(PermissaoEnum);

/**
 * Type helper para as permissões
 */
export type TipoPermissao = PermissaoEnum;

/**
 * Agrupamentos de permissões por funcionalidade para facilitar atribuição
 */
export const GRUPOS_PERMISSOES = {
  // Permissões básicas para visualização
  VISUALIZACAO_BASICA: [
    PermissaoEnum.OCORRENCIAS_VISUALIZAR,
    PermissaoEnum.CASOS_VISUALIZAR_TODOS,
    PermissaoEnum.CASOS_VER_NOTIFICACOES,
  ],

  // Permissões para criação e edição básica
  EDICAO_BASICA: [
    PermissaoEnum.OCORRENCIAS_CRIAR,
    PermissaoEnum.CASOS_DEFINIR_COMENTARIOS,
    PermissaoEnum.CASOS_DEFINIR_LOCALIZACAO,
  ],

  // Permissões para gestão de casos
  GESTAO_CASOS: [
    PermissaoEnum.CASOS_ALTERAR_DATA_OBITO,
    PermissaoEnum.CASOS_ALTERAR_DATA_ACIDENTE,
    PermissaoEnum.CASOS_DEFINIR_CAUSA_PRIMARIA,
    PermissaoEnum.CASOS_DEFINIR_CAUSA_SECUNDARIA,
    PermissaoEnum.CASOS_DEFINIR_DIAGNOSTICO,
    PermissaoEnum.CASOS_REGISTRAR_NOTIFICACAO,
    PermissaoEnum.CASOS_ENVIAR_CONVITE_MEMBRO,
  ],

  // Permissões administrativas/configuração
  ADMINISTRACAO: [
    PermissaoEnum.SISTEMA_CRIAR_ADMIN,
    PermissaoEnum.CASOS_CADASTRAR_CAUSAS,
    PermissaoEnum.CASOS_CADASTRAR_DIAGNOSTICOS,
    PermissaoEnum.CASOS_CADASTRAR_TIPOS_NOTIFICACAO,
  ],
} as const;

// Definindo coordenação após GESTAO_CASOS estar disponível
export const PERMISSOES_COORDENACAO = [
  PermissaoEnum.OCORRENCIAS_ACEITAR,
  PermissaoEnum.OCORRENCIAS_NAO_INCORPORAR,
  ...GRUPOS_PERMISSOES.GESTAO_CASOS,
] as const;

/**
 * Export do enum para facilitar importação
 */
export { PermissaoEnum };
