export interface EnviarEmailTextoPuroDto {
  destinatario: {
    nome: string;
    email: string;
    instituicao: string;
  };
  mensagem: string;
  assunto: string;
}

export interface EnviarEmailTextoPuroRedefinicaoDto {
  destinatario: {
    nome: string;
    email: string;
  };
  mensagem: string;
  assunto: string;
}
