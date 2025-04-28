export interface EnviarEmailTextoPuroDto {
  destinatario: {
    nome: string;
    email: string;
    instituicao: string;
  };
  mensagem: string;
  assunto: string;
}
