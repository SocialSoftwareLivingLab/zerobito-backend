import { PerfilUsuario } from '@/app/usuarios/enums/perfil-usuario.enum';

export class UsuarioAutenticadoDto {
  id: number;
  nome: string;
  email: string;
  perfil?: {
    codigo: string;
    nome: string;
    permissoes: string[];
  };
}
