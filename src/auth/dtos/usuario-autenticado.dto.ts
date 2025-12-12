import { PerfilUsuario } from '@/app/usuarios/enums/perfil-usuario.enum';
import { Expose } from 'class-transformer';

export class UsuarioAutenticadoDto {
  @Expose()
  id: number;

  nome: string;
  email: string;

  @Expose()
  perfis?: {
    codigo: string;
    nome: string;
    permissoes: string[];
  }[];
}
