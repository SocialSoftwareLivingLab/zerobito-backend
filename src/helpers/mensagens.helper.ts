enum Usuario {
  USUARIO_JA_CADASTRADO = 'Usuário já cadastrado',
  USUARIO_NAO_ENCONTRADO = 'Usuário não foi encontrado',
  LOGIN_USUARIO_NAO_ENCONTRADO = 'E-mail e/ou senha inválidos',
}

enum Documentos {
  CNPJ_INVALIDO = 'CNPJ inválido',
}

enum Contatos {
  TELEFONE_INVALIDO = 'Telefone inválido',
  EMAIL_INVALIDO = 'E-mail inválido',
}

enum Ocorrencias {
  OCORRENCIA_NAO_ENCONTRADA = 'Ocorrência não encontrada',
  OCORRENCIA_NAO_PODE_SER_ACEITA = 'Ocorrência não pode ser aceita',
}

enum Coordenadores {
  COORDENADOR_NAO_ENCONTRADO = 'Coordenador não encontrado',
}

enum Casos {
  CASO_NAO_ENCONTRADO = 'Caso não encontrado',
  PALAVRA_CHAVE_NAO_ENCONTRADA = 'Palavra-chave não encontrada',
}

export const MensagensHelper = {
  Usuario,
  Documentos,
  Contatos,
  Ocorrencias,
  Coordenadores,
  Casos,
};
