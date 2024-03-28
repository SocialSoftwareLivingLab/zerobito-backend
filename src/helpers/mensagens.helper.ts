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

export const MensagensHelper = {
  Usuario,
  Documentos,
  Contatos,
};
