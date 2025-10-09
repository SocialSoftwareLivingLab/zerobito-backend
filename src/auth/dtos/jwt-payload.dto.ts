export class JwtPayload {
  sub: number;
  email: string;
  nome: string;
  perfis?: {
    codigo: string;
    nome: string;
    permissoes: string[];
  }[];
}
