/**
 * Enum das permissões específicas do sistema baseado nos requisitos
 */
export enum PermissaoEnum {
  // Sistema/Administração
  SISTEMA_CRIAR_ADMIN = 'sistema:criar-admin',


  // Ocorrências
  OCORRENCIAS_VISUALIZAR_TODOS = 'ocorrencias:visualizar-todos',
  OCORRENCIAS_VISUALIZAR = 'ocorrencias:visualizar',
  OCORRENCIAS_CRIAR = 'ocorrencias:criar',
  OCORRENCIAS_EDITAR = 'ocorrencias:editar',
  OCORRENCIAS_ACEITAR = 'ocorrencias:aceitar',
  OCORRENCIAS_NAO_INCORPORAR = 'ocorrencias:nao-incorporar',

  // Coordenadores
  COORDENADORES_VISUALIZAR = 'coordenadores:visualizar',

  // Casos - Visualização e Listagem
  CASOS_VISUALIZAR_TODOS = 'casos:visualizar-todos',
  CASOS_VISUALIZAR = 'casos:visualizar',

  CASOS_EDITAR_ATA = 'casos:editar-ata',

  // Casos - Dados Básicos
  CASOS_ALTERAR_DATA_OBITO = 'casos:alterar-data-obito',
  CASOS_ALTERAR_DATA_ACIDENTE = 'casos:alterar-data-acidente',
  CASOS_DEFINIR_CAUSA_PRIMARIA = 'casos:definir-causa-primaria',
  CASOS_DEFINIR_CAUSA_SECUNDARIA = 'casos:definir-causa-secundaria',
  CASOS_DEFINIR_DIAGNOSTICO = 'casos:definir-diagnostico',
  CASOS_DEFINIR_COMENTARIOS = 'casos:definir-comentarios',
  CASOS_DEFINIR_LOCALIZACAO = 'casos:definir-localizacao',

  // Casos - Configuração/Cadastros
  CASOS_CADASTRAR_CAUSAS = 'casos:cadastrar-causas',
  CASOS_CADASTRAR_DIAGNOSTICOS = 'casos:cadastrar-diagnosticos',

  // Casos - Notificações
  CASOS_VER_NOTIFICACOES = 'casos:ver-notificacoes',
  CASOS_REGISTRAR_NOTIFICACAO = 'casos:registrar-notificacao',
  CASOS_CADASTRAR_TIPOS_NOTIFICACAO = 'casos:cadastrar-tipos-notificacao',

  // Casos - Membros/Equipe
  CASOS_ENVIAR_CONVITE_MEMBRO = 'casos:enviar-convite-membro',

  // Casos - Investigacao
  CASOS_ALTERAR_MAPA = 'casos:alterar-mapa'
}
