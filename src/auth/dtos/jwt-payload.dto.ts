export class JwtPayload {
  sub: number;
  email: string;
  nome: string;
  perfil?: {
    codigo: string;
    nome: string;
    permissoes: string[];
  };
}
