import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';

declare module 'express' {
  interface Request {
    user: UsuarioAutenticadoDto;
  }
}
