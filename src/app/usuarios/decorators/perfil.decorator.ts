import { SetMetadata } from '@nestjs/common';
import { PerfilUsuario } from '../enums/perfil-usuario.enum';

export const PERFIL_KEY = 'perfil';
export const Perfil = (...roles: PerfilUsuario[]) =>
  SetMetadata(PERFIL_KEY, roles);
