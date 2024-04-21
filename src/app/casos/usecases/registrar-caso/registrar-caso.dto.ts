import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';

export class RegistrarCasoRequest {
  nome: string;
  coordenador: number;
  criador: UsuarioAutenticadoDto;
}

export class RegistrarCasoResponse {
  id: number;
  nome: string;
  coordenador: number;
  dataCriacao: Date;
}
