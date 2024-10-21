export enum PermissoesEnum {
  // Comunicação de evento
  ROLE_COMUNICACAO_EVENTO_CADASTRAR = 'Permite registrar uma nova comunicação de evento',
  ROLE_COMUNICACAO_EVENTO_VISUALIZAR = 'Permite visualizar as comunicações de evento',
  ROLE_COMUNICACAO_EVENTO_ACEITAR = 'Permite aceitar uma comunicação de evento',
  ROLE_COMUNICACAO_EVENTO_ACOMPANHAR = 'Permite acompanhar uma comunicação de evento',
  ROLE_COMUNICACAO_EVENTO_RECUSAR = 'Permite recusar uma comunicação de evento',

  // Casos no geral
  ROLE_CASOS_VISUALIZAR_TODOS = 'Permite visualizar todos os casos',

  // Casos especificos
  ROLE_CASO_DOSSIE_EDITAR_INFO_BASICA_CAUSA_PRIMARIA = 'Permite editar a causa primária de um caso',
  ROLE_CASO_DOSSIE_EDITAR_INFO_BASICA_CAUSA_SECUNDARIA = 'Permite editar a causa secundária de um caso',
  ROLE_CASO_DOSSIE_EDITAR_INFO_BASICA_DIAGNOSTICO = 'Permite editar o diagnóstico de um caso',
  ROLE_CASO_DOSSIE_EDITAR_INFO_BASICA_PALAVRAS_CHAVE = 'Permite editar as palavras-chave de um caso',
  ROLE_CASO_DOSSIE_EDITAR_INFO_BASICA_LOCALIZACAO = 'Permite editar a localização de um caso',
  ROLE_CASO_NOTIFICACOES_VISUALIZAR = 'Permite visualizar as notificações de um caso',
  ROLE_CASO_NOTIFICACOES_REGISTRAR_DOCUMENTO = 'Permite registrar um documento em uma notificação de um caso',
  ROLE_CASO_GRUPO_TABALHO_VISUALIZAR = 'Permite visualizar o grupo de trabalho de um caso',
  ROLE_CASO_GRUPO_TRABALHO_CONVIDAR_MEMBRO = 'Permite convidar um membro para o grupo de trabalho de um caso',
  ROLE_CASO_GRUPO_TRABALHO_CANCELAR_CONVITE = 'Permite cancelar um convite para o grupo de trabalho de um caso',
  ROLE_CASO_GRUPO_TRABALHO_REENVIAR_CONVITE = 'Permite reenviar um convite para o grupo de trabalho de um caso',
  ROLE_CASO_PLANEJAMENTO_VISUALIZAR = 'Permite visualizar o planejamento de um caso',
  ROLE_CASO_INVESTIGACAO_VISUALIZAR = 'Permite visualizar a investigação de um caso',
}
