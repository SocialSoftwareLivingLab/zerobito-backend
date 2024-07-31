export interface EnviarEmailTextoPuroDto {
  destinatario: {
    nome: string;
    email: string;
  };
  mensagem: string;
  assunto: string;
}
